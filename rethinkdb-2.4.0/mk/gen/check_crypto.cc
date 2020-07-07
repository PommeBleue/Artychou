

#include <openssl/bn.h>
#include <openssl/crypto.h>
#include <openssl/evp.h>
int main(){
    CRYPTO_THREADID_set_callback([](CRYPTO_THREADID *id){ CRYPTO_THREADID_set_numeric(id, 0); });
    unsigned char out[4];
    PKCS5_PBKDF2_HMAC(static_cast<char const *>("pass"), 4, nullptr, 0, 1, EVP_sha256(), sizeof(out), out);
    return 0;
}


