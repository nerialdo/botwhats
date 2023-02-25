import { useState, useContext, useEffect } from 'react';
import { Layout } from 'antd';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Spin, message } from 'antd';
import { api } from '../../services/api';

const Produtos = ({addVisible, showDrawer, hiddeDrawer, dados, listarDados, limparStateDado}) => {
    const [ loading, setLoading ] = useState(false)
    const [fields, setFields] = useState([]);

    const [form] = Form.useForm();

    const { Option } = Select;

    const key = 'updatable';

    useEffect(() => {
      console.log('dados carregado', dados?.data)
      if(dados){
        setFields([
          { name: ['name'], value: dados.data.name },
          { name: ['cnes'], value: dados.data.cnes },
        ])
      }
    }, []);

    const openMessage = (tipo) => {
        if(tipo){
            message.success({ content: 'Unidade cadastrada com sucesso!', key });
        }else{
            message.error({ content: 'Erro ao cadastrar dados', key, duration: 2 });
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


    async function editar(value){
      setLoading(true)
      let form_data = new FormData();
      key = 'editar'
      form_data.append("name", value.name);
      form_data.append("cnes", value.cnes);
      await api
          .post(`/unidade/${dados.data.id}`, form_data)
          .then(res => {
              console.log("Unidade editada", res.data)
              message.success({ content: 'Unidade editada com sucesso!', key });
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
            message.error({ content: 'Erro ao editar operador', key, duration: 2 });
          });
    }


    async function salvar(value) {
        setLoading(true)
        let form_data = new FormData();
    
        form_data.append("name", value.name);
        form_data.append("cnes", value.cnes);
    
        await api
            .post(`/unidade`, form_data, {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              }
            })
            .then(res => {
                console.log("Adicionando unidade", res.data)
                setLoading(false)
                openMessage(true)
                showDrawer()
                listarDados()
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
          title={!dados ? 'Cadastrar nova Unidade' : 'Editar dados da Unidade'}
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
                console.log('onChange ', allFields)
            }}
            autoComplete="off"
            className='formCadastro' 
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Nome da Unidade *"
                  rules={[{ required: true, message: 'O nome é obrigatório' }]}
                >
                  <Input placeholder="Nome da Unidade" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="cnes"
                  label={`Código CNES da Unidade`}
                  rules={[{ required: true, message: 'O código é obrigatório' }]}
                >
                  <Input placeholder="Código CNES da Unidade" />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label={`Senha do operador ${!operador ? '*' : ''}`}
                  rules={[{ 
                    required: !operador, 
                    message: 'A senha é obrigatório' 
                  }]}
                >
                  <Input placeholder="Senha do operador" />
                </Form.Item>
              </Col>
            </Row> */}
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
                        {dados ? 'Atualizar dados' : 'Salvar Unidade'} 
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

export default Produtos;