from obf.aes_core import enc_block
k=bytes.fromhex('000102030405060708090a0b0c0d0e0f')
p=bytes.fromhex('00112233445566778899aabbccddeeff')
print(enc_block(p,k).hex())
