from obf.string_pool import literal,recover
P='kappa-matrix-2026'
items=['alpha','beta','gamma','finite-field','rijndael','xor-polynomial']
for s in items:
    h=literal(s,P)
    print(h,recover(h,P))
