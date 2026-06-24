#pragma once
#include <cstdint>
#include <vector>
namespace obf{
uint32_t xs(uint32_t x);
std::vector<uint8_t> stream(uint32_t s,size_t n);
std::vector<uint8_t> crypt(const std::vector<uint8_t>& d,uint32_t s);
}
