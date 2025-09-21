import React, { useState, useEffect } from "react";
import { Card } from "semantic-ui-react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  Menu,
  MenuItem,
  Select,
  Input,
  Button,
  GridColumn,
  Grid,
} from "semantic-ui-react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const Home = () => {
  const toast = useToast();

  const [data, setData] = useState([]);
  const [pages, setPages] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNote, setSelectedNote] = useState(null);

  const [title, setTitle] = useState("");
  const [edittitle, setEditTitle] = useState("");
  const [category, setCategory] = useState("");
  const [editcategory, setEditCategory] = useState("");
  const [description, setDescription] = useState("");
  const [editdescription, setEditDescription] = useState("");

  const [isOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  // GET DATA

  const getData = async (page = 1) => {
    const token = sessionStorage.getItem("Token");
    try {
      // API URL
      let apiUrl = `https://notepad-backend-production.up.railway.app/note/?page=${page}`;
  
      //sorting
      if (sortOrder) {
        apiUrl += `&sort=title&order=${sortOrder}`;
      }
  
      //filter
      if (selectedCategory) {
        apiUrl += `&category=${selectedCategory}`;
      }
  
      //search
      if (searchTerm) {
        apiUrl += `&title=${searchTerm}`;
      }
  
      const res = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      setPages(res.data.totalPages);
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  

  // CREATE NOTE

  const submitAdd = () => {
    const payload = JSON.stringify({ title, category, description });
    const token = sessionStorage.getItem("Token");
    fetch("https://notepad-backend-production.up.railway.app/note/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: payload,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.msg === "Note created") {
          toast({
            position: "top",
            title: res.msg,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          getData(currentPage);
          setIsCreateOpen(false);
        } else {
          toast({
            position: "top",
            title: res.msg || "Not Created",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsCreateOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          position: "top",
          title: "An error occurred during Creation ",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsCreateOpen(false);
      });
  };

  // DELETE NOTE

  const handleNoteDelete = () => {
    if (!selectedNote) {
      console.error("Selected note is null or undefined");
      setIsDeleteOpen(false);
      return;
    }

    const noteId = selectedNote._id;
    const token = sessionStorage.getItem("Token");

    fetch(
      `https://notepad-backend-production.up.railway.app/note/delete/${noteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Note delted Successfully") {
          toast({
            position: "top",
            title: res.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          setData((prevData) => prevData.filter((note) => note._id !== noteId));
          setIsDeleteOpen(false);
        } else {
          toast({
            position: "top",
            title: res.message || "Not Deleted",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsDeleteOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          position: "top",
          title: "An error occurred during Deletion",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsDeleteOpen(false);
      });
  };
 

  // EDIT NOTE

  const submitUpdate = () => {
    if (!selectedNote) {
      console.error("Selected note is null or undefined");
      setIsEditOpen(false);
      return;
    }

    const noteId = selectedNote._id;
    const payload = JSON.stringify({
      title: edittitle,
      category: editcategory,
      description: editdescription,
    });
    const token = sessionStorage.getItem("Token");

    fetch(
      `https://notepad-backend-production.up.railway.app/note/edit/${noteId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: payload,
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Note Updated Successfully") {
          toast({
            position: "top",
            title: res.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          setData((prevData) =>
            prevData.map((note) =>
              note._id === noteId
                ? {
                    ...note,
                    title: edittitle,
                    category: editcategory,
                    description: editdescription,
                  }
                : note
            )
          );

          setIsEditOpen(false);
        } else {
          toast({
            position: "top",
            title: res.message || "Not Updated",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsEditOpen(false);
        }
      })
      .catch((err) => {
        console.error("Error during update:", err);
        toast({
          position: "top",
          title: "An error occurred during Update",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsEditOpen(false);
      });
  };

  const sortOptions = [
    { key: "", value: "", text: "Select" },
    { key: "asc", value: "asc", text: "Ascending Order" },
    { key: "desc", value: "desc", text: "Descending Order" },
  ];

  const filterOptions = [
    { key: "", value: "", text: "Select" },
    { key: "Important", value: "Important", text: "Important Notes" },
    { key: "Local", value: "Local", text: "Local Notes" },
  ];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getData(pageNumber);
  };

  const Pagination = () => {
    const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1);

    return (
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        {pageNumbers.map((pageNumber) => (
          <Button
            basic
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            primary={currentPage === pageNumber}
          >
            {pageNumber}
          </Button>
        ))}
      </div>
    );
  };

  const handleNoteClick = (note) => {
    // console.log("Clicked note:", note);

    setEditTitle(note.title);
    setEditCategory(note.category);
    setEditDescription(note.description);

    setIsEditOpen(true);
    setSelectedNote(note);
  };

  useEffect(() => {
    getData();
  }, [currentPage, sortOrder, selectedCategory, searchTerm]);
  

  return (
    <div className="homeOperation">
      <Menu secondary>
        <MenuItem>
          <Select
            placeholder="Sort by title"
            options={sortOptions}
            value={sortOrder}
            onChange={(e, { value }) => setSortOrder(value)}
          />
        </MenuItem>
        <MenuItem>
          <Input
            icon="search"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </MenuItem>

        <MenuItem>
          <Select
            placeholder="Filter by category"
            options={filterOptions}
            value={selectedCategory}
            onChange={(e, { value }) => setSelectedCategory(value)}
          />
        </MenuItem>
        <MenuItem>
          <>
            <Button basic color="blue" onClick={() => setIsCreateOpen(true)}>
              Add
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsCreateOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create new note</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input
                      placeholder="Enter title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Category</FormLabel>
                    <Select
                      placeholder="Choose category"
                      options={filterOptions}
                      value={category}
                      onChange={(e, { value }) => setCategory(value)}
                    />
                  </FormControl>
                </ModalBody>
                <ModalBody>
                  <FormControl mt={0}>
                    <FormLabel>Description</FormLabel>
                    <Input
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button mr={3} onClick={submitAdd}>
                    Save
                  </Button>
                  <Button
                    color="red"
                    onClick={() => setIsCreateOpen(false)}
                    basic
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        </MenuItem>
      </Menu>
      <Grid columns={4} className="girdcard">
        {data?.map((note) => (
          <GridColumn key={note._id}>
            <Card>
              <Card.Content>
                <Card.Header>{note.title}</Card.Header>
                <Card.Meta>{note.category}</Card.Meta>
                <Card.Description>{note.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <>
                  <Button
                    basic
                    color="green"
                    onClick={() => handleNoteClick(note)}
                  >
                    Edit
                  </Button>

                  <Modal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit a note</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <FormControl>
                          <FormLabel>Title</FormLabel>
                          <Input
                            placeholder="Enter title"
                            value={edittitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        </FormControl>

                        <FormControl mt={4}>
                          <FormLabel>Category</FormLabel>
                          <Select
                            placeholder="Choose category"
                            options={filterOptions}
                            value={editcategory}
                            onChange={(e, { value }) => setEditCategory(value)}
                          />
                        </FormControl>
                      </ModalBody>
                      <ModalBody>
                        <FormControl mt={0}>
                          <FormLabel>Description</FormLabel>
                          <Input
                            placeholder="Enter description"
                            value={editdescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />
                        </FormControl>
                      </ModalBody>
                      <ModalFooter>
                        <Button mr={3} onClick={submitUpdate}>
                          Save
                        </Button>
                        <Button
                          color="red"
                          onClick={() => setIsEditOpen(false)}
                          basic
                        >
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
                <>
                  <Button
                    basic
                    color="red"
                    onClick={() => {
                      setIsDeleteOpen(true);
                      handleNoteClick(note);
                      setIsEditOpen(false);
                    }}
                  >
                    Delete
                  </Button>

                  <AlertDialog isOpen={isDeleteOpen}>
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Delete a note
                        </AlertDialogHeader>

                        <AlertDialogBody>
                          Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button
                            basic
                            color="green"
                            onClick={() => {
                              setIsDeleteOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button color="red" onClick={handleNoteDelete} ml={3}>
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </>
              </Card.Content>
            </Card>
          </GridColumn>
        ))}
      </Grid>
      <Pagination />
    </div>
  );
};

export default Home;
