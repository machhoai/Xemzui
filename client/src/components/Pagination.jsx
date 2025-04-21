import { useEffect, useRef, useState } from "react"
import {ArrowForwardOutline, ArrowBackOutline} from "react-ionicons"

export default function PaginationWithHighlight({ handlePageChange, pages = 100 }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [highlightStyle, setHighlightStyle] = useState({})
  const wrapperRef = useRef(null)
  
  const updateHighlight = () => {
    const wrapper = wrapperRef.current
    const active = wrapper?.querySelector(`[data-page='${currentPage}']`)
    if (active) {
      const { offsetLeft, offsetWidth } = active
      setHighlightStyle({
        transform: `translateX(${offsetLeft}px)`,
        width: `${offsetWidth}px`,
      })
    }
  }

  const getVisiblePages = () => {
    const visible = []
    const totalPages = pages
  
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
  
    visible.push(1) // Luôn hiển thị trang đầu tiên
  
    // Hiển thị dấu "..." nếu trang hiện tại cách quá xa trang đầu
    if (currentPage > 4) {
      visible.push("...")
    }
  
    // Hiển thị 5 trang xung quanh trang hiện tại
    const start = Math.max(2, currentPage - 2) // Bắt đầu từ trang hiện tại - 2
    const end = Math.min(totalPages - 1, currentPage + 2) // Kết thúc từ trang hiện tại + 2
  
    // Thêm các trang từ start đến end vào danh sách
    for (let i = start; i <= end; i++) {
      visible.push(i)
    }
  
    // Hiển thị dấu "..." nếu trang hiện tại cách quá xa trang cuối
    if (currentPage < totalPages - 3) {
      visible.push("...")
    }
  
    visible.push(totalPages) // Luôn hiển thị trang cuối cùng
  
    return visible
  }
  
  
  

  useEffect(() => {
    updateHighlight()
    window.addEventListener("resize", updateHighlight)
    return () => window.removeEventListener("resize", updateHighlight)
  }, [currentPage])

  const changePage = (newPage) => {
    if (newPage !== currentPage) {
        setCurrentPage(newPage)
        if (handlePageChange) handlePageChange(newPage);
    }
  }

  return (
    <div className="inline-flex items-center space-x-2 mt-8 relative">
      <button
        onClick={() => changePage(Math.max(1, currentPage - 1))}
        className="px-3 py-1 text-sm rounded hover:bg-gray-200"
        disabled={currentPage === 1}
      >
        <ArrowBackOutline color={"#"} height="20px" width="20px"></ArrowBackOutline>
      </button>

      <div ref={wrapperRef} className="relative flex space-x-1 px-1">
        {/* Highlight */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded text-white transition-all duration-300 z-0"
          style={highlightStyle}
        />   
        {getVisiblePages().length > 1 && getVisiblePages().map((page, idx) => (
        <button
            key={idx}
            disabled={page === "..."}
            data-page={page}
            onClick={() => typeof page === "number" && changePage(page)}
            className={`relative z-10 px-3 py-1 text-md mx-1 rounded ${
            currentPage === page ? "text-white" : "hover:bg-gray-100"
            } ${page === "..." ? "cursor-default text-gray-400" : ""}`}
        >
            {page}
        </button>
        ))}
      </div>
      {/* <button
        onClick={() => changePage(Math.min(pages.length, currentPage + 1))}
        className="px-3 py-1 text-sm rounded hover:bg-gray-200"
        disabled={currentPage === pages.length}
      >
        <ArrowForwardOutline color={"#"} height="20px" width="20px"></ArrowForwardOutline>
      </button> */}
    </div>
  )
}
