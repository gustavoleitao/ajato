import bcrypt from 'bcrypt'

class Crypt {

  async encrypt(data:any) {
    return await bcrypt.hash(data, 10)
  }

  async compare(data:any, encrypted:string):Promise<boolean>{
    return await bcrypt.compare(data, encrypted)
  }

}

export = Crypt
