from obf.aes_ctr_obf import wrap,unwrap
x=b'cryptographic obfuscation laboratory payload'
y=wrap(x,'lambda')
print(y.hex())
print(unwrap(y,'lambda'))
