"use client";

import React, { useState } from 'react'
import Filters from './components/filters';
import Search from './components/search';
import List from './components/list';

const Ecosystem = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    all: true,
    wallets: false,
    apps: false,
    tools: false,
  })

  return (
    <div className='flex flex-col py-24 px-4 gap-6 items-center justify-center max-w-5xl mx-auto'>
      <h1 className='text-5xl font-bold mb-10'>Ecosystem</h1>
      <div className='flex gap-4 justify-between w-full sm:flex-row flex-col'>
        <Filters filters={filters} setFilters={setFilters} />
        <Search search={search} setSearch={setSearch} />
      </div>
      <List
        search={search}
        filters={filters}
      />

    </div>
  )
}

export default Ecosystem;