import { useEffect, useState } from "react";
import "./App.css";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectComment } from "./redux/selectors";
import { addComment, deleteComment } from "./redux/commentSlice";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function App() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const comments = useSelector(selectComment);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await fetch("https://jsonfakery.com/movies/random/1");
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        const data = await response.json();
        setMovie(data[0]);
      } catch (e) {
        console.log(e.message);
        setError(e.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    }
    fetchMovie();
  }, []);

  const schema = yup.object().shape({
    comment: yup
      .string()
      .required("Le commentaire est obligatoire.")
      .max(500, "Votre commentaire ne peux dépasser 500 caractères."),
    note: yup
      .number()
      .required("Veuillez sélectionnez une note.")
      .min(1, "Note minimale : 1")
      .max(5, "Note maximale : 5"),
    acceptConditions: yup
      .boolean()
      .oneOf([true], "Vous devez accepter les conditions générales."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(addComment({ comment: data.comment, note: data.note }));
    console.log(data);
    reset();
  };

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger">Erreur : {error}</p>
      </div>
    );

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  return (
    <Container className="my-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1>Film</h1>
          {movie && (
            <Card className="mb-4">
              <Card.Img variant="top" src={movie.poster_path} />
              <Card.Body>
                <Card.Title>{movie.original_title}</Card.Title>
                <Card.Text className="text-muted">
                  Sortie le{" "}
                  {new Date(movie.release_date).toLocaleDateString("fr-FR")}
                </Card.Text>
                <Card.Text>{movie.overview}</Card.Text>
                <Card.Text>
                  Note moyenne : {movie.vote_average} ({movie.vote_count} votes)
                </Card.Text>
              </Card.Body>
            </Card>
          )}

          <h2>Commentaires</h2>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <Form.Group className="mb-3" controlId="formText">
              <Form.Label>Ajouter un commentaire</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("comment")}
                isInvalid={!!errors.comment}
              />
              <Form.Control.Feedback type="invalid">
                {errors.comment?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNote">
              <Form.Label>Note</Form.Label>
              <Form.Select {...register("note")} isInvalid={!!errors.note}>
                <option value="0">Sélectionnez une note</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.note?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTerms">
              <Form.Check
                type="checkbox"
                label="J'accepte les conditions générales"
                {...register("acceptConditions")}
                feedback={errors.acceptConditions?.message}
                feedbackType="invalid"
                isInvalid={!!errors.acceptConditions}
              />
            </Form.Group>

            <Button type="submit">Ajouter</Button>
          </Form>

          {comments.length === 0 ? (
            <Alert>Aucun commentaire pour le moment.</Alert>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="mb-2">
                <Card.Body>
                  <Card.Text className="mb-0">
                    <strong> Note : {comment.note}/5 </strong>
                  </Card.Text>
                  <Card.Text>{comment.comment}</Card.Text>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="danger"
                      onClick={() => dispatch(deleteComment(comment.id))}
                    >
                      Supprimer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
