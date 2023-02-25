import { useState, useContext, useEffect, Alert } from 'react';
import { Layout } from 'antd';
import { 
  Drawer, Form, Button, Col, Row, Table, Select, DatePicker, Space, Spin, message, Tooltip, InputNumber, Menu, Dropdown  
} from 'antd';
import { PlusCircleFilled, OrderedListOutlined, MinusCircleFilled, DeleteFilled} from '@ant-design/icons';
import { api } from '../../services/api';

const Consumo = ({
  addVisible,
  showDrawer,
  hiddeDrawer,
  quarto,
  movimentacao,
  isAuthenticated,
  operador
}) => {
    const [ loading, setLoading ] = useState(false)
    const [fields, setFields] = useState([]);
    const [addProduto, setAddProduto] = useState(true);
    const [produtos, setProdutos] = useState([]);
    const [consumo, setConsumo] = useState([]);
    const [qtoProduto, setQtoProduto] = useState(1);
    const [totalConsumo, setTotalConsumo] = useState(0);

    const [form] = Form.useForm();

    const { Option } = Select;

    const key = 'updatable';

    useEffect(() => {
      console.log("quarto", quarto)
      listarProdutos()
      listarConsumo()
    }, []);

    const adicionarProduto = () => {
      setAddProduto(!addProduto)
    }


    function onChangeNumber(value) {
      console.log('changed', value);
      setQtoProduto(value)
    }
    function btnAdicionarQto(value) {
      var newQto = 0
      newQto = qtoProduto += value
      setQtoProduto(newQto)
    }
    function btnDiminuirQto(value) {
      var key = 'btnDiminuirQto'
      if(qtoProduto === 1){
        message.error({ content: 'Quantidade não permitida', key, duration: 2 });
        return
      }
      var newQto = 0
      newQto = qtoProduto - value
      setQtoProduto(newQto)
    }

    async function listarConsumo(){
      var key = 'listar'
      try {
        const {data : result} = await api.get(`movimentacao-produtos/${movimentacao.id}`);
        console.log("Result consumo", result)
        setConsumo(result)
        var total = 0
        for (let t = 0; t < result.length; t++) {
          const element = result[t];
          console.log('Element for', element)
          total = total += element.valor_total
        }
        setTotalConsumo(total)
        // message.success({ content: 'Todos os produtos foram listados!', key });
      } catch (error) {
        console.log("Erro ao listar consumo", error, error.response);
        message.error({ content: 'Erro ao listar consumo', key, duration: 2 });
      }
    }

    async function listarProdutos(){
      var key = 'listar'
      try {
        const {data : result} = await api.get('produto');
        console.log("Result produto", result)
        setProdutos(result)
        message.success({ content: 'Todos os produtos foram listados!', key });
      } catch (error) {
        console.log("Erro ao buscar produtos", error, error.response);
        message.error({ content: 'Erro ao listar produtos', key, duration: 2 });
      }
    }

    async function deletar(value) {
      var key = 'excluir';
      console.log('Deletar', value)
      message.loading({ content: 'Excluíndo, aguarde ...', key });
      try {
        const {data: prod} = await api.delete(`/movimentacao-produtos/${value.id}`);
        // console.log("prod", prod)
        message.success({ content: 'Produto excluído com sucesso!', key });
        listarConsumo(0)
        editarQtoProduto(value.produto, value.qto, 'diminuir')
      } catch (error) {
        console.log("Erro ao deletar", error, error.response);
        message.error({ content: 'Erro ao excluir produto', key, duration: 2 });
      }
    }
  

    async function editar(value, tipo){
      setLoading(true)
      let form_data = new FormData();
      key = 'editar'
      if(value.qto === 1 && tipo === 'diminuir'){
        message.error({ content: 'Quantidade mínima, use o botão para remover produto', key, duration: 3 });
        setLoading(false)
        return
      }
      form_data.append("qto", value.qto);
      form_data.append("tipo", tipo);
      await api
          .post(`/movimentacao-produtos/${value.id}`, form_data)
          .then(res => {
              console.log("Operador editado", res.data)
              message.success({ content: 'Consumo editado com sucesso!', key });
              setLoading(false)
              editarQtoProduto(value.produto, 1, tipo)
              listarConsumo()
          })
          .catch(error => {
            console.log("error: ", error, error.response)
            setLoading(false)
            message.error({ content: 'Erro ao editar consumo', key, duration: 2 });
          });
    }


    async function salvar(value) {
        setLoading(true)
        let form_data = new FormData();
        var key = 'salvar'
        form_data.append("quarto_movimentacao_id", movimentacao.id);
        form_data.append("produto_id", value.id);
        form_data.append("qto", qtoProduto);
        form_data.append("valor_unidade", value.produto_valor);
        form_data.append("valor_total", value.produto_valor * qtoProduto);
    
        await api
            .post(`/movimentacao-produtos`, form_data, {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              }
            })
            .then(res => {
                console.log("Produto adicionado com sucesso", res.data)
                message.success({ content: 'Produto adicionado com sucesso!', key });
                setLoading(false)
                //edita a quantidade do produto
                editarQtoProduto(value, qtoProduto, 'adicionar')
                //atualiza a lista de consumo
                listarConsumo()
                // showDrawer()
            })
            .catch(error => {
              console.log("error: ", error, error.response)
              console.log("response: ", error.response.data.message)
              message.error({ content: 'Erro ao adicionar produto', key, duration: 2 });
              setLoading(false)
            });
    }

    async function editarQtoProduto(value, qto, tipo){
      console.log('value, qto', value, qto)
      var newQto = tipo === 'adicionar' ? parseInt(value.produto_qto) - parseInt(qto) : parseInt(value.produto_qto) + parseInt(qto)
      setLoading(true)
      let form_data = new FormData();
      key = 'editar'
      form_data.append("produto_nome", value.produto_nome);
      form_data.append("produto_descricao", value.produto_descricao);
      form_data.append("produto_valor", value.produto_valor);
      form_data.append("produto_qto", newQto);
      form_data.append("status", value.status);
      await api
          .post(`/produto/${value.id}`, form_data)
          .then(res => {
              console.log("Produto editado", res.data)
              message.success({ content: 'Produto editado com sucesso!', key });
              setLoading(false)
              listarProdutos()
          })
          .catch(error => {
            console.log("error: ", error, error.response)
            setLoading(false)
            message.error({ content: 'Erro ao editar produto', key, duration: 2 });
          });
    }


    function moedaBR(amount, decimalCount = 2, decimal = ",", thousands = "."){
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
        const negativeSign = amount < 0 ? "-" : "";
  
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
  
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
      } catch (e) {
        console.log(e)
      }
    }

    const columns = [
      {
        title: 'Produto',
        dataIndex: 'produto',
        key: 'produto',
        render: text => <span>{text.produto_nome}</span>
      },
      {
        title: 'Qto',
        dataIndex: 'qto',
        key: 'qto',
      },
      {
        title: 'R$ V.Uni',
        dataIndex: 'valor_unidade',
        key: 'valor_unidade',
        render: text => <span>{moedaBR(text)}</span>
      },
      {
        title: 'R$ V.Total',
        dataIndex: 'valor_total',
        key: 'valor_total',
        render: text => <span>{moedaBR(text)}</span>
      },
      {
        title: '',
        // dataIndex: 'id',
        key: 'acao',
        render: text => (
          <div>
            {/* <Dropdown.Button overlay={menu}></Dropdown.Button> */}
            {/* <Tooltip title="Adicionar mais produto">
              <Button onClick={() => { editar(text, 'adicionar') }} type="primary" shape="circle" icon={<PlusCircleFilled />} />
            </Tooltip> */}
            <Tooltip title="Diminuir quantidade de produto">
              <Button onClick={() => { editar(text, 'diminuir') }} style={{background: 'orange'}} type="primary" shape="circle" icon={<MinusCircleFilled />} />
            </Tooltip>
            <Tooltip title="Remover produto">
              <Button onClick={() => { deletar(text) }} style={{background: 'red'}} type="primary" shape="circle" icon={<DeleteFilled />} />
            </Tooltip>
          </div>
        )
      },
    ];
    

    function handleMenuClick(e) {
      console.log('click', e);
    }
    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">1st item</Menu.Item>
        <Menu.Item key="2">2nd item</Menu.Item>
        <Menu.Item key="3">3rd item</Menu.Item>
      </Menu>
    );

    return(
        <Drawer
          title={quarto ? `Consumo do Quarto (${quarto.quarto_nome})` : 'Consumo do Quarto'}
          width={720}
          placement={'left'}
          onClose={hiddeDrawer}
          visible={addVisible}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={hiddeDrawer}>Cancelar</Button>
            </Space>
          }
        >
          <Row style={{marginBottom: 20}} gutter={16}>
              <Col span={12}>
                {!addProduto && (
                  <Button onClick={() => {adicionarProduto()}} type="primary" shape="round" icon={<OrderedListOutlined />} size={'large'}>
                    Listar produtos
                  </Button>
                )}
                {addProduto && (
                  <Button onClick={() => {adicionarProduto()}} type="primary" shape="round" icon={<PlusCircleFilled />} size={'large'}>
                    Adicionar produto
                  </Button>
                )}
              </Col>
              {/* {addProduto && ( */}
                <Col span={12}>
                  <div className="resumoTotalDraw">
                    <span>Total</span>
                    <span style={{fontSize: 21, fontWeight: 'bold'}}>{moedaBR(totalConsumo)}</span>
                  </div>
                </Col>
              {/* )} */}
          </Row>
          {addProduto && (
            <Row gutter={16}>
              <Col className="gutter-row" span={24}>
                <div className='headerComanda'>Produtos na comanda</div>
              </Col>
              <Col className="gutter-row" span={24}>
                <Table 
                  dataSource={consumo} 
                  columns={columns} 
                  pagination={false}
                />
              </Col>
            </Row>
          )}
          {!addProduto && (
            <Row gutter={16}>
              <Col className="gutter-row" span={24}>
                <div className='adicionarQto'>
                  <Tooltip title="Diminuir quantidade">
                    <Button onClick={() => { btnDiminuirQto(1) }} style={{background: 'red'}} type="primary" shape="circle" icon={<MinusCircleFilled />} />
                  </Tooltip>
                  <div>
                  <InputNumber min={1} max={100} defaultValue={3} value={qtoProduto} onChange={onChangeNumber} />
                  </div>
                  <Tooltip title="Aumentar quantidade">
                    <Button onClick={() => { btnAdicionarQto(1) }} type="primary" shape="circle" icon={<PlusCircleFilled />} />
                  </Tooltip>
                </div>
              </Col>
              {produtos.map((item, key) => (
                <Col key={key} className="gutter-row" span={6}>
                  <div 
                    onClick={() => {
                      if(item.produto_qto === 0){
                        alert('Este produto esta com o estoque ZERADO, informa o gerente para reposição do estoque')
                      }else{
                        salvar(item)
                      }
                    }}
                    style={{
                      backgroundColor: item.produto_qto < 5 ?
                      'red' : 'rgb(0, 146, 255)',
                      padding: '8px 0px',
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      height: '100px',
                      alignItems: 'center',
                      borderRadius: '5px',
                      cursor: `pointer`,
                      marginBottom: 10,
                      color: '#fff'
                    }}
                  >
                    {item.produto_nome}
                    <span style={{ fontSize: 21 }}>
                      {moedaBR(item.produto_valor)}
                    </span>
                    <span>
                      ({item.produto_qto})
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
          )}
          {loading && (
            <div className='loading'>
                <Spin size="large" />
                Salvando ...
            </div>
          )}
        </Drawer>
    )
}

export default Consumo;