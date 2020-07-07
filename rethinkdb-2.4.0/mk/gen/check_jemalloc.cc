

#include <jemalloc/jemalloc.h>

int main(){
    // Jemalloc 4 fixes some bugs concerning the handling of OOM conditions
    static_assert(JEMALLOC_VERSION_MAJOR >= 4, "jemalloc version 4 or above is required");
}


