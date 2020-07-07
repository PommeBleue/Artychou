

#include <openssl/ssl.h>
int main(){
    SSL_CTX_set_options(
        SSL_CTX_new(SSLv23_method()),
        SSL_OP_NO_SSLv2|SSL_OP_NO_SSLv3|SSL_OP_NO_TLSv1|SSL_OP_NO_TLSv1_1|SSL_OP_CIPHER_SERVER_PREFERENCE|SSL_OP_SINGLE_DH_USE|SSL_OP_SINGLE_ECDH_USE);
    return 0;
}


