import { Controller, Get } from "./decorators/ajato.decorator"

@Controller('/algo')
export default class TestControlller {

    @Get()
    doIt(){
        console.log('Chamou a função doit!')
    }

}

const con:TestControlller = new TestControlller()
con.doIt()