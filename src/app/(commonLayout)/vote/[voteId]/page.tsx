/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */



const VotesCount = async({params,}:{params:{postId:string}}) => {
    const res = await fetch(`http://localhost:5000/api/v1/votes/${params.postId}`,{
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