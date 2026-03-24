"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchNotes } from "../../lib/api";
import NoteList from "../../components/NoteList/NoteList";
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import css from "./NotesPage.module.css";

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search),
  });

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox
          onSearch={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            onPageChange={(p) => setPage(p)}
            forcePage={page - 1}
          />
        )}

        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </div>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
