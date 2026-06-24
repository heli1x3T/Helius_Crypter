from .masks import xorshift32

def qres(x,p=65537):
    return pow(x%p,(p-1)//2,p) in (0,1)

def predicate(seed,x):
    a=xorshift32(seed^x)|1
    b=xorshift32(a+0x6d2b79f5)
    c=(a*a+2*a*b+b*b)&0xffffffff
    d=((a+b)&0xffffffff)**2&0xffffffff
    return c==d

def branch_index(seed,x,n):
    y=xorshift32(seed^x)
    z=(y*(y|1)+0x9e3779b9)&0xffffffff
    return z%n
