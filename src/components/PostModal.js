import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Post from './Post';

const PostModal = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <a onClick={handleShow}>
        Launch demo modal
      </a>

      <Modal className="post-modal fade" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Post />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PostModal;