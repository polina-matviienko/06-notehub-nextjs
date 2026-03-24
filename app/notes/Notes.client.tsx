"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
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

  const [debouncedSearch] = useDebounce(search, 500);

  const { data } = useQuery({
    queryKey: ["notes", page, debouncedSearch, 9],
    queryFn: () => fetchNotes(page, debouncedSearch, 9),

    placeholderData: keepPreviousData,
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
