from .gf256 import mul,table
S=table()
RCON=[0,1,2,4,8,16,32,64,128,27,54]

def bx(a,b):return bytes(x^y for x,y in zip(a,b))
def sub_word(w):return bytes(S[x] for x in w)
def rot_word(w):return w[1:]+w[:1]
def g(w,i):return bytes([sub_word(rot_word(w))[0]^RCON[i]])+sub_word(rot_word(w))[1:]

def expand(k):
    n=len(k)//4
    if n not in (4,6,8):raise ValueError('key')
    r={4:10,6:12,8:14}[n]
    w=[k[i:i+4] for i in range(0,len(k),4)]
    i=n
    while len(w)<4*(r+1):
        t=w[-1]
        if i%n==0:t=g(t,i//n)
        elif n>6 and i%n==4:t=sub_word(t)
        w.append(bx(w[i-n],t));i+=1
    return [b''.join(w[i:i+4]) for i in range(0,len(w),4)]

def add_round(s,k):
    return [x^y for x,y in zip(s,k)]

def sub_bytes(s):return [S[x] for x in s]

def shift_rows(s):
    return [s[0],s[5],s[10],s[15],s[4],s[9],s[14],s[3],s[8],s[13],s[2],s[7],s[12],s[1],s[6],s[11]]

def mix_col(c):
    a,b,d,e=c
    return [mul(a,2)^mul(b,3)^d^e,a^mul(b,2)^mul(d,3)^e,a^b^mul(d,2)^mul(e,3),mul(a,3)^b^d^mul(e,2)]

def mix_columns(s):
    r=[]
    for i in range(0,16,4):r+=mix_col(s[i:i+4])
    return r

def enc_block(p,k):
    rk=expand(k);s=list(p)
    s=add_round(s,rk[0])
    for i in range(1,len(rk)-1):
        s=mix_columns(shift_rows(sub_bytes(s)))
        s=add_round(s,rk[i])
    s=shift_rows(sub_bytes(s))
    s=add_round(s,rk[-1])
    return bytes(s)
