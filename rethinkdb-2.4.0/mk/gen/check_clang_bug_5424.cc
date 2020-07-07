#include <iostream>
int output = 1;
class data_t {
public:
    data_t(int num) {
    }
    ~data_t() {
        output = 0;
    }
};
struct data_struct_t {
    data_t some_data;
    data_t some_other_data;
};
int main() {
  output = 1;
    {
        data_struct_t{1, 2};
    }
    return output;
}
