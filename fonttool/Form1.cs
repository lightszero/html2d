using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows.Forms;
using TMPro.EditorUtilities;

namespace fonttool
{
    public partial class Form1 : Form
    {


        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            //init fontengine.
            int v = TMPro_FontPlugin.Initialize_FontEngine();
            this.listLog.Items.Add("init font engine." + v);

            //list font.
            string[] files = System.IO.Directory.GetFiles("font\\", "*.ttf");
            foreach (var f in files)
            {
                this.listFont.Items.Add(f);
            }

            //load word
            this.textoutput.Text = System.IO.File.ReadAllText("word.txt");
        }
        enum FontPackingModes { Fast = 0, Optimum = 4 };

        void exportFont(string fontfile, string textout, int texwidth= 2048,int  texheight= 2048)
        {


            FT_FaceInfo fi = new FT_FaceInfo();
            FT_GlyphInfo[] ginfo = null;
            int[] charset;
            int m_character_Count;
            //TMPro_FontPlugin.Init((str) =>
            //    {
            //        this.listBox1.Items.Add(str);
            //    });
            //加载字体
            int v2 = TMPro_FontPlugin.Load_TrueType_Font(fontfile);

            //指定字号
            int v3 = TMPro_FontPlugin.FT_Size_Font(30);


            //设置缓存尺寸
            byte[] buf = new byte[texwidth * texheight];


            List<int> arrays = new List<int>();
            foreach (var it in textout.ToArray())
            {
                if (arrays.Contains((int)it) == false)
                    arrays.Add((int)it);
            }
            ginfo = new FT_GlyphInfo[arrays.Count];
            ginfo[0].id = 555;
            charset = arrays.ToArray();
            m_character_Count = charset.Length;

            listLog.Items.Add("char count=" + m_character_Count);
            //TMPro_FontPlugin.outStruct some = new TMPro_FontPlugin.outStruct();
            //some.info = new FT_GlyphInfo[100];
            //计算线程
            Thread t = new Thread(() =>
              {
                  var pout = Marshal.UnsafeAddrOfPinnedArrayElement(ginfo, 0);

                  //var i2 = TMPro_FontPlugin.Render_Character(buf, buf, 512, 512, 0, (int)'你', FaceStyles.Normal, 0, RenderModes.Smooth, ref ginfo[0]);
                  var i = TMPro_FontPlugin.Render_Characters
                  (buf, texwidth, texheight, //buf
                  1,//padding
                  charset, m_character_Count,
                  FaceStyles.Normal, 16,//stoke
                  false,
                  RenderModes.DistanceField16, (int)FontPackingModes.Fast, ref fi, pout);
              });
            t.Start();

            //进度跟踪线程
            Thread t2 = new Thread(() =>
            {
                while (true)
                {
                    float b = TMPro_FontPlugin.Check_RenderProgress();
                    if (b >= 1.0f)
                        break;
                    else
                    {
                        this.Invoke(new Action(() =>
                        {
                            this.Text = (int)(b * 100) + "%";
                        }));
                    }
                    System.Threading.Thread.Sleep(100);
                }
                Bitmap bmp = new Bitmap(texwidth, texheight);
                for (int y = 0; y < texheight; y++)
                {
                    for (int x = 0; x < texwidth; x++)
                    {
                        byte c = buf[(texheight - y - 1) * texwidth + x];
                        bmp.SetPixel(x, y, Color.FromArgb(c, c, c));
                    }
                }
                this.Invoke(new Action(() =>
                {
                    this.Text = "100%";
                    this.pictureBox1.Image = bmp;

                    bmp.Save(fontfile + ".png");
                    string outstr = "";
                    outstr += "{";
                    outstr += "\"font\":[\"" + fi.name + "\"," + fi.pointSize + "," + fi.padding + "," + fi.lineHeight + "," + fi.baseline + "," + fi.atlasWidth + "," + fi.atlasHeight + "],\n";
                    outstr += "\"map\":{\n";
                    List<FT_GlyphInfo> useinfos = new List<FT_GlyphInfo>();
                    for (int i = 0; i < ginfo.Length; i++)
                    {
                        var g = ginfo[i];
                        if (g.id < 0)
                            continue;
                        char c = (char)g.id;
                        if (c == '\n' || c == '\t' || c == '\r')
                            continue;
                        useinfos.Add(g);
                    }
                    for (int i = 0; i < useinfos.Count; i++)
                    {
                        var g = useinfos[i];
                        if (g.id < 0)
                            continue;
                        char c = (char)g.id;
                        if (c == '\n' || c == '\t' || c == '\r')
                            continue;

                        string sp = c.ToString();
                        if (c == '"')
                            sp = "\\\"";
                        if (c == '\\')
                            sp = "\\\\";

                        outstr += "\"" + sp + "\":[" + g.x + "," + g.y + "," + g.width + "," + g.height + "," + g.xOffset + "," + g.yOffset + "," + g.xAdvance + "]";
                        if (i != useinfos.Count - 1)
                            outstr += ",";
                        outstr += "\n";
                    }
                    outstr += "}";
                    outstr += "}";
                    System.IO.File.WriteAllText(fontfile + ".cfg", outstr);
                }));



            });
            t2.Start();




        }

        private void exportToolStripMenuItem_Click(object sender, EventArgs e)
        {

        }

        private void export2048ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string fontfile = listFont.SelectedItem as string;
            if (fontfile == null) return;

            this.menuStrip1.Enabled = false;
            exportFont(fontfile, this.textoutput.Text,2048,2048);
        }

        private void export1024ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string fontfile = listFont.SelectedItem as string;
            if (fontfile == null) return;

            this.menuStrip1.Enabled = false;
            exportFont(fontfile, this.textoutput.Text, 1024, 1024);
        }

        private void export512ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string fontfile = listFont.SelectedItem as string;
            if (fontfile == null) return;

            this.menuStrip1.Enabled = false;
            exportFont(fontfile, this.textoutput.Text, 512, 512);
        }
    }
}
