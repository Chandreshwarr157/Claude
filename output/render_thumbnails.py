#!/usr/bin/env python3
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random

FD = "/mnt/skills/examples/canvas-design/canvas-fonts/"
RAVEN = "/home/user/Claude/output/assets/raven.png"
W, H = 1280, 720

def F(name, size): return ImageFont.truetype(FD + name + ".ttf", size)

# ---------- gradient helpers ----------
def radial(cx, cy, rx, ry, stops):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    d = np.clip(d, 0, 1)
    pos = np.array([s[0] for s in stops], np.float32)
    out = np.zeros((H, W, 3), np.float32)
    for c in range(3):
        out[:, :, c] = np.interp(d, pos, np.array([s[1][c] for s in stops], np.float32))
    return out

def screen(base, layer):  # both float 0..255
    return 255 - (255 - base) * (255 - layer) / 255.0

# ---------- text helpers ----------
def text_w(font, text, tracking):
    return sum(font.getlength(ch) + tracking for ch in text) - (tracking if text else 0)

def draw_tracked(img, xy, text, font, fill, tracking=0, anchor="la",
                 stroke_width=0, stroke_fill=None):
    d = ImageDraw.Draw(img)
    x, y = xy
    tw = text_w(font, text, tracking)
    if "m" in anchor: x -= tw / 2
    elif "r" in anchor: x -= tw
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill,
               stroke_width=stroke_width, stroke_fill=stroke_fill)
        x += font.getlength(ch) + tracking
    return tw

def glow_text(canvas, xy, text, font, color, tracking=0, anchor="la",
              blur=14, passes=((1.0, 1.0),), core=(255, 255, 255, 255)):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_tracked(layer, xy, text, font, color + (255,), tracking, anchor)
    for b_mul, a_mul in passes:
        g = layer.filter(ImageFilter.GaussianBlur(blur * b_mul))
        if a_mul != 1.0:
            r, gg, bb, aa = g.split(); aa = aa.point(lambda v: int(v * a_mul)); g = Image.merge("RGBA",(r,gg,bb,aa))
        canvas.alpha_composite(g)
    coreL = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_tracked(coreL, xy, text, font, core, tracking, anchor)
    canvas.alpha_composite(coreL)

def soft_circle(size, color, feather):
    s = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(s)
    d.ellipse([feather, feather, size - feather, size - feather], fill=color)
    return s.filter(ImageFilter.GaussianBlur(feather))

def load_char(mirror=False):
    im = Image.open(RAVEN).convert("RGBA")
    if mirror: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    return im

def place_char(canvas, char, target_h, anchor_x, bottom, glow_rgb, glow_strength=0.55):
    scale = target_h / char.height
    cw = int(char.width * scale); ch = int(char.height * scale)
    c = char.resize((cw, ch), Image.LANCZOS)
    if "r" in anchor_x[0]: x = anchor_x[1] - cw
    elif "m" in anchor_x[0]: x = anchor_x[1] - cw // 2
    else: x = anchor_x[1]
    y = bottom - ch
    # rim glow behind
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    a = c.split()[3]
    sil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    tint = Image.new("RGBA", (cw, ch), glow_rgb + (255,)); tint.putalpha(a)
    sil.alpha_composite(tint, (x, y))
    glow = sil.filter(ImageFilter.GaussianBlur(26))
    r, g, b, al = glow.split(); al = al.point(lambda v: int(v * glow_strength)); glow = Image.merge("RGBA",(r,g,b,al))
    canvas.alpha_composite(glow)
    # drop shadow
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shc = Image.new("RGBA", (cw, ch), (0, 0, 0, 255)); shc.putalpha(a)
    sh.alpha_composite(shc, (x + (14 if "r" in anchor_x[0] else -14), y + 12))
    sh = sh.filter(ImageFilter.GaussianBlur(16))
    r, g, b, al = sh.split(); al = al.point(lambda v: int(v * 0.6)); sh = Image.merge("RGBA",(r,g,b,al))
    canvas.alpha_composite(sh)
    canvas.alpha_composite(c, (x, y))
    return x, y, cw, ch

def ghost_char(canvas, char, target_h, x, bottom, tint_rgb, opacity, hue_dark=True):
    scale = target_h / char.height
    cw = int(char.width * scale); ch = int(char.height * scale)
    c = char.resize((cw, ch), Image.LANCZOS)
    arr = np.asarray(c).astype(np.float32)
    a = arr[:, :, 3:4] / 255.0
    tint = np.array(tint_rgb, np.float32)
    rgb = tint.reshape(1, 1, 3) * (0.5 if hue_dark else 1.0)
    out = np.dstack([rgb * np.ones((ch, cw, 3)), arr[:, :, 3] * opacity]).astype(np.uint8)
    g = Image.fromarray(out, "RGBA").filter(ImageFilter.GaussianBlur(1))
    canvas.alpha_composite(g, (x, bottom - ch))

def rounded(draw, box, r, fill):
    draw.rounded_rectangle(box, radius=r, fill=fill)

def badge_bgmi(canvas, x, y, mark_grad, txt_color, accent):
    # diamond mark
    m = Image.new("RGBA", (66, 66), (0, 0, 0, 0))
    md = ImageDraw.Draw(m)
    md.rounded_rectangle([8, 8, 58, 58], radius=12, fill=mark_grad)
    m = m.rotate(45, expand=True, resample=Image.BICUBIC)
    canvas.alpha_composite(m, (x, y - 6))
    bd = ImageDraw.Draw(canvas)
    bd.text((x + 30, y + 14), "B", font=F("BigShoulders-Bold", 34), fill=(255,255,255,255), anchor="mm")
    tx = x + 64
    draw_tracked(canvas, (tx, y + 2), "BATTLEGROUNDS", F("Tektur-Medium", 24), txt_color + (255,), 1)
    draw_tracked(canvas, (tx, y + 30), "MOBILE INDIA", F("Tektur-Regular", 15), accent + (255,), 5)

def badge_live(canvas, right_x, y, glow=False):
    bw = 116; x = right_x - bw
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    rounded(d, [x, y, x + bw, y + 46], 9, (226, 0, 38, 255))
    if glow:
        gl = layer.filter(ImageFilter.GaussianBlur(12))
        r,g,b,a = gl.split(); a=a.point(lambda v:int(v*0.8)); canvas.alpha_composite(Image.merge("RGBA",(r,g,b,a)))
    canvas.alpha_composite(layer)
    d2 = ImageDraw.Draw(canvas)
    d2.ellipse([x + 16, y + 16, x + 30, y + 30], fill=(255, 255, 255, 255))
    draw_tracked(canvas, (x + 42, y + 6), "LIVE", F("BigShoulders-Bold", 30), (255,255,255,255), 2)

# ============================================================
# THUMBNAIL 1 — CRIMSON INFERNO
# ============================================================
def thumb1():
    random.seed(7)
    bg = radial(0.72*W, 0.38*H, 1.12*W, 1.10*H, [
        (0.0,(255,70,52)),(0.26,(196,12,28)),(0.52,(96,4,18)),
        (0.78,(28,4,12)),(1.0,(8,3,11))])
    # vignette
    yy, xx = np.mgrid[0:H,0:W].astype(np.float32)
    vig = 1 - np.clip(((xx-0.5*W)/(0.62*W))**2 + ((yy-0.5*H)/(0.62*H))**2, 0, 1)*0.55
    bg *= vig[:,:,None]
    canvas = Image.fromarray(np.clip(bg,0,255).astype(np.uint8),"RGB").convert("RGBA")

    # smoke blobs
    for (sx,sy,sz,col,op) in [(-60,-90,520,(255,90,50),0.5),(W-180,H-260,640,(255,50,50),0.42),
                              (int(0.45*W),int(0.55*H),420,(0,0,0),0.55)]:
        blob = soft_circle(sz,(*col,int(255*op)),sz//4)
        canvas.alpha_composite(blob,(sx,sy))
    # diagonal slashes
    sl = Image.new("RGBA",(W,H),(0,0,0,0)); sd=ImageDraw.Draw(sl)
    for (yy0,op,th) in [(130,150,4),(250,110,3),(500,100,3),(600,130,3)]:
        sd.line([(-50,yy0+200),(W*0.8,yy0-120)],fill=(255,40,46,op),width=th)
    canvas.alpha_composite(sl.filter(ImageFilter.GaussianBlur(1)))

    char = load_char()
    ghost_char(canvas, char, 660, int(W*0.42), 700, (255,40,40), 0.22)

    # giant hollow RAVEN behind
    big = F("BigShoulders-Bold", 360)
    fill = Image.new("RGBA",(W,H),(0,0,0,0))
    draw_tracked(fill,(W*0.45,250),"RAVEN",big,(255,255,255,20),6,"mm")
    canvas.alpha_composite(fill)
    hollow = Image.new("RGBA",(W,H),(0,0,0,0))
    draw_tracked(hollow,(W*0.45,250),"RAVEN",big,(0,0,0,0),6,"mm",stroke_width=4,stroke_fill=(255,255,255,240))
    canvas.alpha_composite(hollow.filter(ImageFilter.GaussianBlur(9)))
    canvas.alpha_composite(hollow)

    place_char(canvas, char, 770, ("r",1300), 726, (255,70,40), 0.5)

    # embers
    em = Image.new("RGBA",(W,H),(0,0,0,0)); ed=ImageDraw.Draw(em)
    for _ in range(60):
        ex,ey=random.randint(0,W),random.randint(60,H); r=random.randint(2,5)
        ed.ellipse([ex-r,ey-r,ex+r,ey+r],fill=(255,150,60,random.randint(120,220)))
    canvas.alpha_composite(em.filter(ImageFilter.GaussianBlur(1)))
    em2=Image.new("RGBA",(W,H),(0,0,0,0)); ed2=ImageDraw.Draw(em2)
    for _ in range(40):
        ex,ey=random.randint(0,W),random.randint(60,H); r=random.randint(1,2)
        ed2.ellipse([ex-r,ey-r,ex+r,ey+r],fill=(255,210,150,255))
    canvas.alpha_composite(em2)

    # top/bottom cinematic bars
    bd=ImageDraw.Draw(canvas)
    for yb in (0,714):
        bar=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(bar).rectangle([0,yb,W,yb+6],fill=(255,40,46,180))
        canvas.alpha_composite(bar.filter(ImageFilter.GaussianBlur(2)))

    badge_bgmi(canvas, 30, 30, (255,42,42,255), (255,255,255), (255,70,80))
    badge_live(canvas, W-30, 28)

    # name tag right
    draw_tracked(canvas,(W-36,250),"X - SUIT",F("BigShoulders-Bold",26),(255,255,255,235),8,"ra")
    glow_text(canvas,(W-36,278),"RAVEN",F("BigShoulders-Bold",76),(255,30,40),2,"ra",blur=10,
              passes=((1.0,0.7),),core=(255,255,255,255))

    # footer
    draw_tracked(canvas,(34,630),"YOUR NAME HERE",F("BigShoulders-Bold",46),(255,255,255,255),1)
    draw_tracked(canvas,(36,684),"CONQUEROR PUSH  •  CUSTOM ROOMS  •  RUSH GAMEPLAY",
                 F("Tektur-Regular",15),(255,210,210,210),3)

    canvas.convert("RGB").save("/home/user/Claude/output/thumbnail-1.png", quality=95)
    print("thumb1 done")

# ============================================================
# THUMBNAIL 2 — CYBER FROST
# ============================================================
def thumb2():
    random.seed(11)
    bg = radial(0.30*W,0.25*H,1.18*W,1.30*H,[
        (0.0,(46,95,205)),(0.30,(26,46,120)),(0.58,(12,20,66)),
        (0.80,(6,9,33)),(1.0,(4,5,16))])
    canvas = Image.fromarray(np.clip(bg,0,255).astype(np.uint8),"RGB").convert("RGBA")

    # aurora glows
    for (sx,sy,sz,col,op) in [(int(0.10*W),int(0.10*H),560,(55,230,255),0.5),
                              (int(0.62*W),int(0.12*H),620,(122,75,255),0.45),
                              (int(0.45*W),int(0.62*H),520,(255,61,240),0.3)]:
        canvas.alpha_composite(soft_circle(sz,(*col,int(255*op)),sz//4),(sx,sy))

    # perspective grid (bottom)
    grid=Image.new("RGBA",(W,H),(0,0,0,0)); gd=ImageDraw.Draw(grid)
    horizon=int(H*0.62); vanish=W//2
    for i in range(1,11):
        t=i/10.0; y=int(horizon+(H-horizon)*t*t)
        gd.line([(0,y),(W,y)],fill=(55,230,255,int(120*t)),width=1)
    for vx in range(-10,11):
        bx=vanish+vx*70; gd.line([(vanish+vx*8,horizon),(bx,H)],fill=(55,230,255,70),width=1)
    canvas.alpha_composite(grid)

    # big faded bg text
    ft=Image.new("RGBA",(W,H),(0,0,0,0))
    draw_tracked(ft,(W/2,150),"BATTLEGROUNDS",F("BigShoulders-Bold",150),(0,0,0,0),4,"mm",stroke_width=2,stroke_fill=(180,230,255,46))
    draw_tracked(ft,(W/2,300),"MOBILE INDIA",F("BigShoulders-Bold",150),(200,235,255,26),10,"mm")
    canvas.alpha_composite(ft)

    char = load_char(mirror=True)
    ghost_char(canvas, char, 660, int(W*0.04), 700, (60,160,255), 0.18, hue_dark=False)
    place_char(canvas, char, 770, ("l",-30), 726, (55,200,255), 0.6)

    # scanlines
    sc=Image.new("RGBA",(W,H),(0,0,0,0)); scd=ImageDraw.Draw(sc)
    for y in range(0,H,4): scd.line([(0,y),(W,y)],fill=(255,255,255,18),width=1)
    canvas.alpha_composite(sc)

    # neon name bottom-center
    glow_text(canvas,(W/2,560),"RAVEN",F("Tektur-Medium",118),(40,200,255),6,"mm",blur=18,
              passes=((1.6,0.8),(1.0,0.9),(0.5,1.0)),core=(234,252,255,255))
    draw_tracked(canvas,(W/2,690),"X - SUIT   •   RANKED GRIND",F("Tektur-Regular",16),(200,240,255,220),6,"mm")

    badge_bgmi(canvas, 28, 28, (55,200,255,255), (234,250,255), (55,230,255))
    badge_live(canvas, W-28, 26, glow=True)

    # barcode + caption bottom-left
    bx,by=30,628; bd=ImageDraw.Draw(canvas)
    xx=bx
    random.seed(3)
    for _ in range(46):
        w=random.choice([1,1,2,3]);
        if random.random()>0.35: bd.rectangle([xx,by,xx+w,by+32],fill=(223,246,255,220))
        xx+=w+2
        if xx>bx+150: break
    draw_tracked(canvas,(30,668),"RAVEN X-SUIT // NEXT-GEN AMV EDIT",F("GeistMono-Bold",12),(190,225,255,180),1)
    draw_tracked(canvas,(30,686),"WORLDWIDE • 4K • 60FPS",F("GeistMono-Regular",12),(150,190,235,160),2)

    # social circles bottom-right
    sd=ImageDraw.Draw(canvas)
    labels=["f","t","+"]; sx=W-28-3*44
    for i,l in enumerate(labels):
        cx=sx+i*44
        sd.ellipse([cx,668,cx+34,702],outline=(160,220,255,200),width=2)
        sd.text((cx+17,685),l,font=F("BigShoulders-Bold",20),fill=(223,246,255,255),anchor="mm")

    # corner frame ticks
    cd=ImageDraw.Draw(canvas); L=34; col=(120,220,255,200); t=3
    for (cx,cy,dx,dy) in [(14,14,1,1),(W-14,14,-1,1),(14,H-14,1,-1),(W-14,H-14,-1,-1)]:
        cd.line([(cx,cy),(cx+dx*L,cy)],fill=col,width=t)
        cd.line([(cx,cy),(cx,cy+dy*L)],fill=col,width=t)

    canvas.convert("RGB").save("/home/user/Claude/output/thumbnail-2.png", quality=95)
    print("thumb2 done")

thumb1(); thumb2()
print("ALL DONE")
