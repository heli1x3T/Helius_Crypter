def rol(x,n,w=32):
    n%=w;m=(1<<w)-1
    return ((x<<n)|(x>>(w-n)))&m

def ror(x,n,w=32):
    n%=w;m=(1<<w)-1
    return ((x>>n)|(x<<(w-n)))&m

def xorshift32(x):
    x&=0xffffffff
    x^=(x<<13)&0xffffffff
    x^=(x>>17)&0xffffffff
    x^=(x<<5)&0xffffffff
    return x&0xffffffff

def split_const(x,n=5):
    s=(x*0x9e3779b1+0x7f4a7c15)&0xffffffff
    a=[];r=x&0xffffffff
    for i in range(n-1):
        s=xorshift32(s+i)
        a.append(s);r^=s
    a.append(r)
    return a

def rebuild(v):
    r=0
    for x in v:r^=x&0xffffffff
    return r

def affine_mask(x,a,b,m=0xffffffff):
    return ((x*a)+b)&m

def affine_unmask(y,a,b,m=0xffffffff):
    mod=m+1
    inv=pow(a,-1,mod)
    return ((y-b)*inv)&m
