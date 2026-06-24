from obf.cfg_flatten import run
p=[('set','x',0x1337),('xor','x',0x41414141),('add','x',0x1234),('mix','x',0x45d9f3b,0x9e37),('acc','x'),('ret','x')]
print(hex(run(p)))
