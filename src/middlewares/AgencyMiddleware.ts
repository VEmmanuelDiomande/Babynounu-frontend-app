export const AgencyMiddleware = async (to: any,  nToken:any, redirect:any) => {
    if(nToken == null && to.path.includes('/agency') == true){
        return redirect
    }
};