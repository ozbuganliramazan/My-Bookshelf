import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import "../assets/styles/buttons.css";
import urls from "../api/urls";
import api from "../api/api";
import actionTypes from "../redux/actions/actionTypes";
import CustomModal from "./CunstomModal";
import { Link } from "react-router-dom";

const ListBooks = () => {
  const { booksState, categoriesState } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [willDeleteBook, setWillDeleteBook] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(booksState.books);

  useEffect(() => {
    const temp = booksState.books.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) === true ||
        item.author.toLowerCase().includes(searchText.toLowerCase()) === true
    );
    setFilteredBooks(temp);
  }, [searchText,booksState.books]);

  const deleteBook = (id) => {
    dispatch({ type: actionTypes.bookActions.DELETE_BOOK_START });
    api
      .delete(`${urls.books}/${id}`)
      .then((res) => {
        dispatch({
          type: actionTypes.bookActions.DELETE_BOOK_SUCCESS,
          payload: id,
        });
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.bookActions.DELETE_BOOK_FAIL,
          payload: "Kitap silerken hata oluştu",
        });
      });
  };

  return (
    <div className=" my-5" >
      <div className="d-flex justify-content-center w-75">
        <input
          className="form-control w-75"
          type="text"
          placeholder="Aramak istediğiniz kitabın ismini girin..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </div>
     {
      categoriesState.categories.lenght === 0 ? (
        <div className="d-flex justify-content-end">
        <Link to={"/add-category"} className="btn btn-primary">
      Öncelikle Kategori Eklenmeli
        </Link>
      </div>
      ):(
        <div className="d-flex justify-content-end">
        <Link to={"/add-book"} className="btn btn-primary">
          Kitap Ekle
        </Link>
      </div>
      )

     }
      
      <table className="table table-striped ">
        <thead>
          <tr>
            <th scope="col">Sıra No</th>
            <th scope="col">Adı</th>
            <th scope="col">Yazar</th>
            <th scope="col">Kategori</th>
            <th scope="col">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book, index) => {
            const myCategory = categoriesState.categories.find(
              (item) => item.id === book.categoryId
            );
            return (
              <tr key={book.id}>
                <th scope="row">{index + 1}</th>
                <td>{book.name}</td>
                <td>{book.author}</td>
                <td>{myCategory.name}</td>
                <td>
                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setWillDeleteBook(book.id);
                    }}
                    className="generalBtn deleteBtn"
                  >
                    Sil
                  </button>
                  <Link
                    to={`/edit-book/${book.id}`}
                    className="generalBtn editBtn"
                  >
                    Güncelle
                  </Link>
                  <Link to={`/book-detail/${book.id}`} className="generalBtn ">
                    Detay
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {showDeleteModal === true && (
        <CustomModal
          title="Silme"
          message="Silmek istediğinize emin misiniz?"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            deleteBook(willDeleteBook);
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
};
export default ListBooks;
