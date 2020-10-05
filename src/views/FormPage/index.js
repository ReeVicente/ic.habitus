import React, { useState, useEffect } from "react";
import { Form, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import { auth } from "../../configs/firebase";
import { updateUser } from "../../services/user";

import Button from "../../components/elements/Button";

import { useHistory } from "react-router-dom";
import { Alert } from "../../helpers/Alert";

import Video from "react-responsive-video";

const schema = yup.object().shape({
  water: yup.string().required("Por favor, selecione uma opção"),
  workPause: yup.string().required("Por favor, selecione uma opção"),
  posture: yup.string().required("Por favor, selecione uma opção"),
  stress: yup.string().required("Por favor, selecione uma opção"),
  sedentary: yup.string().required("Por favor, selecione uma opção"),
  pain: yup.string().required("Por favor, selecione uma opção"),
});

function FormPage() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        history.replace("entrar");
      }
    });
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const selectedInterventions = [];
    Object.keys(data).map((k) => {
      if (data[k] === "true") {
        selectedInterventions.push(k);
      }
    });

    try {
      await updateUser({
        interventions: selectedInterventions,
      });
      Alert({
        title: "Questionário salvo com sucesso",
        type: "success",
      });
      history.push("/user");
    } catch (err) {
      Alert({
        title: "Erro ao salvar formulário",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
    console.log(selectedInterventions);
  };

  return (
    <div style={{ marginTop: 130 }}>
      <h1 className="text-center">Triagem de dados</h1>
      <Container>
        <div className="d-flex align-items-center flex-column">
          <Video
            mp4={require("../../assets/videos/posture.mp4")}
            style={{ maxWidth: "100%", width: "600px", marginBottom: 50}}
            objectFit={`contain`}
          />
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="flex-column">
              <label>Você bebe de dois a três litros de água por dia?</label>
              <div key={`inline-radio`} className="mb-3">
                <Form.Check
                  inline
                  ref={register}
                  label="Sim"
                  name="water"
                  type="radio"
                  value={false}
                  id={`inline-radio-1`}
                />
                <Form.Check
                  inline
                  ref={register}
                  label="Não"
                  name="water"
                  type="radio"
                  value={true}
                  id={`inline-radio-2`}
                />
              </div>
              <Form.Text className="text-danger">
                {errors.water?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="flex-column">
              <label>Você costuma fazer pausar durante o trabalho?</label>
              <div key={`inline-radio`} className="mb-3">
                <Form.Check
                  inline
                  ref={register}
                  label="Sim"
                  name="workPause"
                  type="radio"
                  value={false}
                  id={`inline-radio-1`}
                />
                <Form.Check
                  inline
                  ref={register}
                  label="Não"
                  name="workPause"
                  type="radio"
                  value={true}
                  id={`inline-radio-2`}
                />
              </div>
              <Form.Text className="text-danger">
                {errors.workPause?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="flex-column">
              <label>
                Você acredita que mantêm uma postura adequada durante sua rotina
                de trabalho?
              </label>
              <div key={`inline-radio`} className="mb-3">
                <Form.Check
                  inline
                  ref={register}
                  label="Sim"
                  name="posture"
                  type="radio"
                  value={false}
                  id={`inline-radio-1`}
                />
                <Form.Check
                  inline
                  ref={register}
                  label="Não"
                  name="posture"
                  type="radio"
                  value={true}
                  id={`inline-radio-2`}
                />
              </div>
              <Form.Text className="text-danger">
                {errors.posture?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="flex-column">
              <label>
                Você tem se estressado durante sua rotina de trabalho?
              </label>
              <div key={`inline-radio`} className="mb-3">
                <Form.Check
                  inline
                  ref={register}
                  label="Sim"
                  name="stress"
                  type="radio"
                  value={true}
                  id={`inline-radio-1`}
                />
                <Form.Check
                  inline
                  ref={register}
                  label="Não"
                  name="stress"
                  type="radio"
                  value={false}
                  id={`inline-radio-2`}
                />
              </div>
              <Form.Text className="text-danger">
                {errors.stress?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="flex-column">
              <label>Você se considera uma pessoa sedentária?</label>
              <div key={`inline-radio`} className="mb-3">
                <Form.Check
                  inline
                  ref={register}
                  label="Sim"
                  name="sedentary"
                  type="radio"
                  value={true}
                  id={`inline-radio-1`}
                />
                <Form.Check
                  inline
                  ref={register}
                  label="Não"
                  name="sedentary"
                  type="radio"
                  value={false}
                  id={`inline-radio-2`}
                />
              </div>
              <Form.Text className="text-danger">
                {errors.sedentary?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="flex-column">
              <label>Você sente dores ou desconforto no trabalho?</label>
              <div key={`inline-radio`} className="mb-3">
                <Form.Check
                  inline
                  ref={register}
                  label="Sim"
                  name="pain"
                  type="radio"
                  value={true}
                  id={`inline-radio-1`}
                />
                <Form.Check
                  inline
                  ref={register}
                  label="Não"
                  name="pain"
                  type="radio"
                  value={false}
                  id={`inline-radio-2`}
                />
              </div>
              <Form.Text className="text-danger">
                {errors.pain?.message}
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
                Salvar
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default FormPage;
