import React, { useState } from "react";
import { Form, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import { auth } from "../../configs/firebase";
import { addUser } from "../../services/user";

import Button from "../../components/elements/Button";

import { Alert } from "../../helpers/Alert";

import { useHistory } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required("Por favor, insira seu nome"),
  email: yup
    .string()
    .email("Endereço de e-mail inválido")
    .required("Por favor, insira seu endereço de e-mail"),
  genre: yup
    .string()
    .required("Por favor, selecione seu gênero")
    .notOneOf([""], "Por favor, selecione seu gênero"),
  password: yup
    .string()
    .required("Por favor, insira uma senha segura")
    .min(5, "Por favor insira sua senha de no mínimo 5 caracteres"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Senhas não correspondentes"),
  terms: yup
    .bool()
    .required()
    .oneOf([true], "Você precisa aceitar os termos e condições"),
});

function RegisterPage() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async ({
    name,
    bornDate,
    genre,
    email,
    password,
    terms,
  }) => {
    if (!terms) {
      return;
    }

    setIsLoading(true);

    try {
      await auth.createUserWithEmailAndPassword(email, password);

      const user = {
        email: email.toLowerCase(),
        name,
        genre,
        bornDate,
        haveForm: false,
      };

      await addUser(user);

      Alert({
        title: "Usuário criado com sucesso",
        type: "success",
      });
      history.push("/entrar");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        Alert({
          title: "Alguém já está utilizando esse e-mail.",
          type: "error",
        });
      } else {
        Alert({
          title: "Não conseguimos criar sua conta",
          text: "Manda uma mensagem pra gente que te ajudamos!",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 130 }}>
      <h1 className="text-center">Cadastrar-se</h1>
      <Container>
        <div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="flex-column" controlId="formName">
              <label>Nome</label>
              <Form.Control
                name="name"
                ref={register}
                placeholder="Nome completo"
              />
              <Form.Text className="text-danger">
                {errors.name?.message}
              </Form.Text>
            </Form.Group>
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
              <label>Data de nascimento</label>
              <Form.Control name="bornDate" ref={register} type="date" />
              <Form.Text className="text-danger">
                {errors.name?.message}
              </Form.Text>
            </Form.Group>
            <Form.Group className="flex-column" controlId="formBasicEmail">
              <label>Sexo</label>
              <Form.Control name="genre" ref={register} as="select" custom>
                <option value="" disabled selected>
                  Selecione uma opção
                </option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </Form.Control>
              <Form.Text className="text-danger">
                {errors.genre?.message}
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
            <Form.Group className="flex-column" controlId="formBasicEmail">
              <label>Confirmar senha</label>
              <Form.Control
                name="passwordConfirmation"
                ref={register}
                type="password"
                placeholder="Confirme sua senha"
              />
              <Form.Text className="text-danger">
                {errors.passwordConfirmation?.message}
              </Form.Text>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check name="terms" type="checkbox" ref={register} />
                <label>
                  Li e concordo com os <a href="#">termos de uso</a>.<br></br>
                  <div className="text-danger">{errors.terms?.message}</div>
                </label>
              </Form.Group>
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button
                loading={isLoading}
                disabled={isLoading}
                type="submit"
                color="primary"
                wideMobile
              >
                Criar conta
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default RegisterPage;
