
function SearchInput() {
    return (
        <main className="w-[80%] flex flex-col justify-center gap-5">
            <input
                className="h-10 w-100  border-white border rounded-full px-6 text-lg shadow-lg focus:outline-none"
                type="search"
                placeholder="Search recipes..."
            />
        </main>
    )
}

export default SearchInput;