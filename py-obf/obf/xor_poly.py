from .masks import xorshift32,rol

def keystream(seed,n):
    x=seed&0xffffffff
    out=bytearray()
    while len(out)<n:
        x=xorshift32((x+0x9e3779b9)&0xffffffff)
        y=rol(x^0xa5a5a5a5,(x>>27)&31)
        out+=y.to_bytes(4,'little')
    return bytes(out[:n])

def crypt(data,seed):
    ks=keystream(seed,len(data))
    return bytes(a^b for a,b in zip(data,ks))

def layers(data,seeds):
    r=data
    for s in seeds:r=crypt(r,s)
    return r
