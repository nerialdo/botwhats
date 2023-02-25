import { useState, useContext, useEffect } from 'react';
import { Layout } from 'antd';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Spin, message } from 'antd';
import { api } from '../../services/api';

import Buscar from '../Forms/Buscar';

const Profissional = ({addVisible, showDrawer, hiddeDrawer, dados, listarDados, limparStateDado}) => {
    const [ loading, setLoading ] = useState(false)
    const [fields, setFields] = useState([]);
    const [resultadoEspecialidades, setResultadoEspecialidades] = useState(null);
    const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState(null);

    const [form] = Form.useForm();

    const { Option } = Select;

    const key = 'updatable';

    useEffect(() => {
      console.log('Profissional carregado', dados)
      buscarEspecialidades()
      if(dados){
        setFields([
          { name: ['nome'], value: dados.nome },
          { name: ['email'], value: dados.email },
          { name: ['cns'], value: dados.cns },
          { name: ['telefone'], value: dados.telefone }
        ])
        setEspecialidadeSelecionada(dados.especialidades[0].id)
      }
    }, []);

    const openMessage = (tipo) => {
        if(tipo){
            message.success({ content: 'Profissional cadastrado com sucesso!', key });
        }else{
            message.error({ content: 'Erro ao cadastrar Profissional', key, duration: 2 });
        }
    };

    const onFinish = async (values) => {
      console.log('Success:', values, dados);
      if(dados){
          editar(values)
      }else{
          salvar(values)
      }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onValuesChange = (value) => {
        // console.log('onValuesChange:', value);
    };

    // edita o relacionamento entre a especialidade e o profissional cadastrado
    async function editarRelacionameto(id) {
      alert(id)
      // console.log('Dados para salvar ', value, id)
        setLoading(true)
        let form_data = new FormData();
        form_data.append("especialidade_id", especialidadeSelecionada);
    
        await api
            .post(`/especialidade_profissional/${id}`, form_data, {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              }
            })
            .then(res => {
                console.log("Editando especialidade do profissional", res.data)
                setLoading(false)
                openMessage(true)
                showDrawer()
                listarDados()
                form.resetFields();
                setEspecialidadeSelecionada(null)
            })
            .catch(error => {
              console.log("error: ", error, error.response)
              console.log("response: ", error.response.data.message)
              setLoading(false)
              openMessage(false)
            });
    }


    async function editar(value){
      setLoading(true)
      let form_data = new FormData();
      key = 'editar'
      form_data.append("nome", value.nome);
      form_data.append("email", value.email);
      form_data.append("telefone", value.telefone);
      form_data.append("cns", value.cns);
      if(!value.password){
        form_data.append("password", value.password);
      }

      await api
          .post(`/profissionais/${dados.id}`, form_data)
          .then(res => {
              // console.log("Profissional editado", res.data.data)
              // editarRelacionameto(res.data.data.id)
              message.success({ content: 'Profissional editado com sucesso!', key });
              setLoading(false)
              setFields([])
              limparStateDado()
              listarDados()
              showDrawer()
              form.resetFields();
          })
          .catch(error => {
            console.log("error: ", error, error.response)
            setLoading(false)
            message.error({ content: 'Erro ao editar Profissional', key, duration: 2 });
          });
    }


    async function buscarEspecialidades(){
      var key = 'listar'
      try {
        const {data : result} = await api.get('especialidades/');
        // console.log("Result especialidades", result.data)
        setResultadoEspecialidades(result.data)
        message.success({ content: 'Especialidades encontradas!', key });
      } catch (error) {
        console.log("Erro ao buscar especialidades", error, error.response);
        message.error({ content: 'Erro ao buscar especialidades', key, duration: 2 });
      }
    }


    // salva o relacionamento entre a especialidade e o profissional cadastrado
    async function salvarRelacionameto(value, id) {
      // console.log('Dados para salvar ', value, id)
        setLoading(true)
        let form_data = new FormData();
    
        form_data.append("user_id", id);
        form_data.append("especialidade_id", especialidadeSelecionada);
    
        await api
            .post(`/especialidade_profissional`, form_data, {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              }
            })
            .then(res => {
                // console.log("Salvando especialidade do profissional", res.data)
                setLoading(false)
                openMessage(true)
                showDrawer()
                listarDados()
                form.resetFields();
                setEspecialidadeSelecionada(null)
            })
            .catch(error => {
              console.log("error: ", error, error.response)
              console.log("response: ", error.response.data.message)
              setLoading(false)
              openMessage(false)
            });
    }


    async function salvar(value) {
        if(!especialidadeSelecionada){
          alert('Você precisa selecionar a especialidade do profissional')
          return
        }
        setLoading(true)
        let form_data = new FormData();
    
        form_data.append("nome", value.nome);
        form_data.append("email", value.email);
        form_data.append("telefone", value.telefone);
        form_data.append("cns", value.cns);
        form_data.append("password", value.password);
    
        await api
            .post(`/profissionais`, form_data, {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              }
            })
            .then(res => {
                // console.log("Adicionando Profissional", res.data.data)
                setLoading(false)
                openMessage(true)
                showDrawer()
                // listarDados()

                salvarRelacionameto(value, res.data.data.id)

                form.resetFields();
            })
            .catch(error => {
              console.log("error: ", error, error.response)
              console.log("response: ", error.response.data.message)
              setLoading(false)
              openMessage(false)
            });
    }


    return(
        <Drawer
          title={!dados ? 'Cadastrar novo Profissional' : 'Editar dados do Profissional'}
          width={720}
          onClose={hiddeDrawer}
          visible={addVisible}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={hiddeDrawer}>Cancelar</Button>
            </Space>
          }
        >
          <Form 
            form={form}
            layout="vertical" 
            hideRequiredMark
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={onValuesChange}
            fields={fields}
            onFieldsChange={(_, allFields) => {
                setFields(allFields);
                // console.log('onChange ', allFields)
            }}
            autoComplete="off"
            className='formCadastro' 
          >
            <Row gutter={16}>
              <Col span={24}>
                <Buscar 
                  disabled={dados}
                  name="especialidade_id"
                  showSearch
                  style={{
                    width: '100%',
                    marginBottom: 30
                  }}
                  placeholder="Pesquisar a especialidade"
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').includes(input)}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  value={especialidadeSelecionada}
                  options={resultadoEspecialidades?.map((item, key) => {
                    return {
                      key, 
                      value: item.id,
                      label: item.name + ' - CBO: ' + item.cbo
                    }
                  })}
                  onSelect={(v) => {
                    setEspecialidadeSelecionada(v)
                  }}
                />
              </Col>
              <Col span={24}>
                <Form.Item
                  name="nome"
                  label="Nome completo do Profissional *"
                  rules={[{ required: true, message: 'O nome é obrigatório' }]}
                >
                  <Input placeholder="Nome do Profissional" />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="email"
                  type="email"
                  label={`Email do Profissional`}
                  rules={[{ required: true, message: 'O email é obrigatório' }]}
                >
                  <Input placeholder="Email do Profissional" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="password"
                  label={`Senha do Profissional ${!dados ? '*' : ''}`}
                  rules={[{ 
                    required: !dados, 
                    message: 'A senha é obrigatório' 
                  }]}
                >
                  <Input placeholder="Senha do Profissional" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="cns"
                  label="CNS do Profissional *"
                  rules={[{ required: true, message: 'O cns é obrigatório' }]}
                >
                  <Input placeholder="CNS do Profissional" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="telefone"
                  label={`Telefone do Profissional`}
                  rules={[{ required: true, message: 'O telefone é obrigatório' }]}
                >
                  <Input placeholder="Telefone do Profissional" />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="tipo"
                  label="Tipo do operador *"
                  rules={[{ required: true, message: 'O tipo é obrigatório' }]}
                >
                  <Select placeholder="Defina o status">
                    <Option value="Comum">Comum</Option>
                    <Option value="Suíte">Suíte</Option>
                    <Option value="Temáticos">Temáticos</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status do operador *"
                  rules={[{ required: true, message: 'O status é obrigatório' }]}
                >
                  <Select placeholder="Defina o status">
                    <Option value="Livre">Livre</Option>
                    <Option value="Ocupado">Ocupado</Option>
                    <Option value="Reservado">Reservado</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row> */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item >
                    <Button style={{width: '100%'}} type="primary" htmlType="submit">
                        {dados ? 'Atualizar dados' : 'Salvar operador'} 
                    </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {loading && (
            <div className='loading'>
                <Spin size="large" />
                Salvando ...
            </div>
          )}
        </Drawer>
    )
}

export default Profissional;