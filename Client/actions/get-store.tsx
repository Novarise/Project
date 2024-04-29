
// const URL=`http://localhost:3000/api/${process.env.STORE}`;
// const URL=`http://localhost:3000/api/${process.env.PORTLAND_STORE}`;
// const getServerSideProps = async (): Promise<any> => {
//   const res = await fetch(URL, {cache: "no-store"});
//   return res.json();
// };
// export default getServerSideProps;

import axios from "axios";


// const URL=`http://localhost:3000/api/${process.env.PORTLAND_STORE}`;
// const URL=`http://${process.env.ADMIN_CONTAINER_HOST}:3000/api/${process.env.PORTLAND_STORE}`;

 const getServerSideProps = async (): Promise<any> => {
   try {

     const URL=`${process.env.ADMIN_CONTAINER_HOST}/api/${process.env.PORTLAND_STORE}`;
     const res = await axios.get(URL, { headers: { 'Cache-Control': 'no-cache' } });
     return res.data;
   } catch (error) {
     console.error(error);
   }
 }
 export default getServerSideProps;


//const URL=`${process.env.ADMIN_CONTAINER_HOST}/api/${process.env.PORTLAND_STORE}`;
//const fetchWithRetry = async (url:string, options:any, n:number) => {
//  for(let i=0; i<n; i++){
//    try {
//      const res = await fetch(url, options);
//      if(res.ok) return res.json();
//    } catch(err) {
//      console.error(`Attempt ${i+1} failed. Retrying...`);
//    }
//    await new Promise(resolve => setTimeout(resolve, 1000));
//  }
//  throw new Error('Server unreachable after ' + n + ' attempts');
//};

//const getServerSideProps = async (): Promise<any> => {
//  try {
    // const res = await axios.get(URL, { headers: { 'Cache-Control': 'no-cache' } });
    // return res.data;
//    const res = await fetchWithRetry(URL, {cache: "no-store"}, 5);
//    console.log(res.json())
//    return res.json();
//  } catch (error) {
//    console.error(error);
//    return null;
//  }
//};
//export default getServerSideProps;
