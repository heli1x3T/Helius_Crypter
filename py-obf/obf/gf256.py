R=0x11b

def xtime(a):
    a&=255
    b=a<<1
    return (b^R)&255 if b&256 else b&255

def mul(a,b):
    a&=255;b&=255;r=0
    while b:
        r^=a if b&1 else 0
        a=xtime(a);b>>=1
    return r&255

def pow(a,n):
    r=1;a&=255
    while n:
        if n&1:r=mul(r,a)
        a=mul(a,a);n>>=1
    return r

def inv(a):
    return 0 if not a else pow(a,254)

def affine(x):
    y=0
    for i in range(8):
        bit=((x>>i)^(x>>((i+4)&7))^(x>>((i+5)&7))^(x>>((i+6)&7))^(x>>((i+7)&7))^(0x63>>i))&1
        y|=bit<<i
    return y

def sbox_byte(x):
    return affine(inv(x))

def table():
    return bytes(sbox_byte(i) for i in range(256))
