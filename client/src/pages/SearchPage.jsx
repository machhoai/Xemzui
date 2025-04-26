import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieList from '../components/MovieList'; // Import MovieList

const SearchPage = () => {
  const { searchTerm } = useParams();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [sort, setSort] = useState('');
  const [showFilter, setShowFilter] = useState(false); // state để điều khiển hiển thị MovieFilter



  return (
    <div id="wrapper" className="pt-20 px-4 md:px-8">
      <h1 style={{ display: 'none' }}>
        Xem Phim {searchTerm} Thuyết Minh, Vietsub HD Online - RoPhim
      </h1>

      <div className="fluid-gap">
        <div className="cards-row wide">
          <div className="row-header flex items-center gap-3 mb-4">
            <div className="inc-icon text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40">
                {/* SVG icon paths here */}
              </svg>
            </div>
            <h3 className="category-name text-xl font-bold text-white">
              Kết quả tìm kiếm "{searchTerm}"
            </h3>
          </div>

          {/* Danh sách phim */}
          <MovieList
            searchTerm={searchTerm}
            selectedGenres={selectedGenres}
            selectedYears={selectedYears}
            sort={sort}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
