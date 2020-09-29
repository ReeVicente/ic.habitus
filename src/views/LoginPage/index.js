import React, { useState } from "react";
import { Form, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import { auth } from "../../configs/firebase";

import Button from "../../components/elements/Button";

import { useHistory } from "react-router-dom";
import { Alert } from "../../helpers/Alert";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Endereço de e-mail inválido")
    .required("Por favor, insira seu endereço de e-mail"),
  password: yup.string().required("Por favor, insira sua senha"),
});

function LoginPage() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const user = await auth.signInWithEmailAndPassword(email, password);
      history.push("/user");
    } catch (err) {
      Alert({
        title: "Usuário e/ou senha incorretos.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 130 }}>
      <h1 className="text-center">Entrar</h1>
      <Container>
        <div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="flex-column" controlId="formEmail">
              <label>E-mail</label>
              <Form.Control
                name="email"
                ref={register}
                type="email"
                placeholder="Endereço de e-mail"
              />
              <Form.Text className="text-danger">
                {errors.email?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="flex-column" controlId="formBasicEmail">
              <label>Senha</label>
              <Form.Control
                name="password"
                ref={register}
                type="password"
                placeholder="Senha"
              />
              <Form.Text className="text-danger">
                {errors.password?.message}
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button
                loading={isLoading}
                disabled={isLoading}
                type="submit"
                color="primary"
                wideMobile
              >
                Entrar
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default LoginPage;
