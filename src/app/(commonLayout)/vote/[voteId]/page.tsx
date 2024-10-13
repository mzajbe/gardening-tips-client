/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */



const VotesCount = async({params,}:{params:{postId:string}}) => {
    const res = await fetch(`https://gardening-server.vercel.app/api/v1/votes/${params.postId}`,{
        cache:"no-store",
    })

    const {data} = await res.json();

    console.log(data);
    
    return (
        <div>
            <h1>hello</h1>
        </div>
    );
};

export default VotesCount;