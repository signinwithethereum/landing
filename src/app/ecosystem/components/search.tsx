import React from 'react'

interface SearchProps {
  search: string;
  setSearch: (search: string) => void;
}

const Search = ({ search, setSearch }: SearchProps) => {
  return (
    <div className='flex items-center justify-center'>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search' className='w-full py-2 px-4 rounded-md bg-transparent border-2 border-gray-400 focus:border-accent focus:outline-none!' />
    </div>
  )
}

export default Search;