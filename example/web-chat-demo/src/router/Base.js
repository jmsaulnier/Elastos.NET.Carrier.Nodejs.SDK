import _ from 'lodash';
import CarrierPool from '../service/CarrierPool';

let POOL = null;
export default class {

    static setRouter(router, list){
        _.each(list, (item)=>{
            router[item.method](item.path, (req, res)=>{
                const r = new item.action(req, res);
                return r.main();
            });
        })

    }

    constructor(req, res){
        this.req = req;
        this.res = res;

        if(!POOL){
            POOL = new CarrierPool();
        }

        this.init();
    }

    init(){}

    async main(){
        try{
            if(!this.validate()){
                this.res.send(401);
            }
            const rs = await this.action();

            if(rs){
                this.res.json(rs);
            }

        }catch(e){
            this.res.json(this.error(e));
        }
    }

    validate(){
        return true;
    }

    async action(){}

    result(data, code=1, msg='ok'){
        return {
            code,
            data,
            text : msg
        };
    }
    error(err, code=-1){
        return {
            code,
            err : err.message || err.reason || err.toString()
        }
    }

    getParam(key){
        const param = _.extend({}, this.req.query, this.req.params);
        return key ? _.get(param, key, null) : param;
    }

    buildCarrierService(id='default_elastos_id'){
        return POOL.getInstance(id);
    }
}