#include <iostream>
#include <iomanip>
#include <vector>
#include "../include/xor_mask.hpp"
int main(){std::vector<uint8_t> d={'o','b','f','u','s','c','a','t','e'};auto e=obf::crypt(d,0x13371337);auto r=obf::crypt(e,0x13371337);for(auto x:e)std::cout<<std::hex<<std::setw(2)<<std::setfill('0')<<(int)x;std::cout<<"\n";for(auto x:r)std::cout<<(char)x;std::cout<<"\n";}
