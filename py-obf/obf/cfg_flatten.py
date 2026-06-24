from .opaque import branch_index,predicate

def run(program,seed=0x12345678):
    pc=0;acc=0;mem={};lim=0
    while pc<len(program) and lim<100000:
        op,*v=program[pc]
        j=branch_index(seed,pc+acc,4)
        if op=='set':mem[v[0]]=v[1];pc+=1
        elif op=='xor':mem[v[0]]^=v[1];pc+=1
        elif op=='add':mem[v[0]]=(mem[v[0]]+v[1])&0xffffffff;pc+=1
        elif op=='mix':mem[v[0]]=((mem[v[0]]*(v[1]|1))^v[2])&0xffffffff;pc+=1
        elif op=='jmp':pc=v[0] if predicate(seed,j) else pc+1
        elif op=='jnz':pc=v[1] if mem.get(v[0],0) else pc+1
        elif op=='acc':acc^=mem.get(v[0],0);pc+=1
        elif op=='ret':return acc^mem.get(v[0],0)
        else:pc+=1
        lim+=1
    return acc
