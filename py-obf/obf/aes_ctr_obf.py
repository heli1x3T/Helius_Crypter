from .aes_core import enc_block
from .kdf import derive
from .xor_poly import layers

def ctr(data,key,nonce=b'\x00'*8):
    out=bytearray();c=0
    for i in range(0,len(data),16):
        block=nonce+c.to_bytes(8,'little')
        ks=enc_block(block,key)
        chunk=data[i:i+16]
        out+=bytes(a^b for a,b in zip(chunk,ks))
        c+=1
    return bytes(out)

def wrap(data,password,salt=b'obf-salt',nonce=b'nonce1234'):
    k=derive(password,salt,1024,16)
    seeds=[int.from_bytes(k[i:i+4],'little') for i in range(0,16,4)]
    return ctr(layers(data,seeds),k,nonce)

def unwrap(data,password,salt=b'obf-salt',nonce=b'nonce1234'):
    k=derive(password,salt,1024,16)
    seeds=[int.from_bytes(k[i:i+4],'little') for i in range(0,16,4)][::-1]
    return layers(ctr(data,k,nonce),seeds)
