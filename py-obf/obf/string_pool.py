from .aes_ctr_obf import wrap,unwrap

def encode(strings,password):
    blob=b'\0'.join(s.encode() for s in strings)
    return wrap(blob,password)

def decode(blob,password):
    return [x.decode() for x in unwrap(blob,password).split(b'\0')]

def literal(s,password):
    return wrap(s.encode(),password).hex()

def recover(h,password):
    return unwrap(bytes.fromhex(h),password).decode()
