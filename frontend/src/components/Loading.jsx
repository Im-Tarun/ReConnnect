
const Loading = ({ height = "100vh" }) => {
    return (
        <div
            style={{
                height
            }} className='flex items-center justify-center w-full'>
            <div
                className="animate-spin inline-block border-t-transparent border-4 size-20 border-purple-500
            rounded-full" ></div>

        </div>
    )
}

export default Loading