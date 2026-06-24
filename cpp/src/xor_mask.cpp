#include "../include/xor_mask.hpp"
namespace obf{
uint32_t xs(uint32_t x){x^=x<<13;x^=x>>17;x^=x<<5;return x;}
std::vector<uint8_t> stream(uint32_t s,size_t n){std::vector<uint8_t> r;uint32_t x=s;while(r.size()<n){x=xs(x+0x9e3779b9u);for(int i=0;i<4&&r.size()<n;i++)r.push_back((x>>(8*i))&255);}return r;}
std::vector<uint8_t> crypt(const std::vector<uint8_t>& d,uint32_t s){auto k=stream(s,d.size());auto r=d;for(size_t i=0;i<r.size();i++)r[i]^=k[i];return r;}
}
