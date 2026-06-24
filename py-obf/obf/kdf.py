from hashlib import sha256,blake2s

def fold(data,n=32):
    h=blake2s(data,digest_size=n).digest()
    for i in range(7):h=sha256(h+data+i.to_bytes(1,'little')).digest()[:n]
    return h

def derive(passphrase,salt,rounds=4096,n=32):
    x=fold(passphrase.encode()+salt,n)
    for i in range(rounds):
        x=blake2s(x+salt+i.to_bytes(4,'little'),digest_size=n).digest()
    return x
