import React, { useRef, useState } from 'react'
import { Card, Space, Tag, Popconfirm, message } from 'antd'
// 导入组件
import SearchBar from '@/components/SearchBar'
import AuthComponent from '@/components/AuthComponent'
import CustomTable from '@/components/CustomTable'
import CustomModal from '@/components/CustomModal'
import DictEditForm from './components/dictEditForm'
import DictItemTable from './components/dictItemTable'
// 导入获取字典hook
import useDict from '@/hooks/useDict'
// 导入api
import dictApi from '@/api/dict'

const Dict = () => {
  // 状态字典
  const statusDict = useDict('status')
  /** 搜索栏参数 */
  // 搜索栏表单项数组
  const formItemList = [
    { formItemProps: { name: 'dict_name', label: '名称' }, valueCompProps: {} },
    { formItemProps: { name: 'dict_code', label: 'code' }, valueCompProps: {} }
    // { formItemProps: { name: 'email', label: '邮箱' }, valueCompProps: {} },
    // {
    //   formItemProps: { name: 'status', label: '状态' },
    //   valueCompProps: { type: 'select', selectvalues: statusDict }
    // }
  ]
  /** 表格参数 */
  // 表格配置项
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '名称',
      dataIndex: 'dict_name',
      align: 'center'
    },
    {
      title: 'code',
      dataIndex: 'dict_code',
      align: 'center'
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => {
        let color = status === '1' ? 'green' : 'red'
        const statusItem = statusDict.find((item) => item.value === status)
        return statusItem ? <Tag color={color}>{statusItem.label}</Tag> : ''
      },
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      align: 'center'
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, row) => (
        <Space
          style={{
            cursor: 'pointer',
            color: '#2378f7',
            fontSize: '15px'
          }}>
          {row.dict_items.length > 0 &&
            <AuthComponent permission="system:dict:check" title="查看" type="link" onClick={() => checkRow(row.id)}>
              查看字典项
            </AuthComponent>
          }
          <AuthComponent permission="system:dict:edit" title="编辑" type="link" onClick={() => editRow(row.id)}>
            编辑
          </AuthComponent>
          <Popconfirm title="删除字典" description="确定要删除吗？" onConfirm={() => deleteRow(row.id)}>
            <AuthComponent permission="system:dict:del" title="删除" type="link" danger>
              删除
            </AuthComponent>
          </Popconfirm>
          {/* <Popconfirm title="重置密码" description="确定要重置吗" onConfirm={() => resetPwd(row.dict_id)}>
            <AuthComponent permission="system:user:resetPwd" type="link" title="重置密码"> */}
          {/* 重置密码 */}
          {/* </AuthComponent>
          </Popconfirm> */}
        </Space>
      ),
      align: 'center'
    }
  ]
  // 表格请求参数
  const [requestParam, setRequestParam] = useState({
    pageSize: 10,
    current: 1
  })
  /** 表格事件 */
  // 改变参数
  const onParamChange = (searchParams) => {
    if (!Object.keys(searchParams).length)
      setRequestParam({
        ...requestParam
      })
    else setRequestParam({ ...requestParam, ...searchParams })
  }
  // 新增
  const addRow = () => {
    setEditType('add')
    setDictId('')
    toggleModalStatus(true)
  }
  // 查看
  const checkRow = (dict_id) => {
    // setEditType('edit')
    setDictId(dict_id)
    toggleTableStatus(true)
  }
  // 编辑
  const editRow = (dict_id) => {
    setEditType('edit')
    setDictId(dict_id)
    toggleModalStatus(true)
  }
  // 删除
  const deleteRow = async (dict_id) => {
    try {
      await dictApi.manage.del({ id: dict_id })
      message.success('删除成功')
      // 重新请求表格
      onParamChange({})
    } catch (e) {
      message.error(e)
    }
  }
  /** 表单参数 */
  // 弹窗实例
  const userModalRef = useRef()
  const dictItemModalRef = useRef()
  // 功能类型
  const [editType, setEditType] = useState()
  // 当前行用户id
  const [dict_id, setDictId] = useState()
  // 弹窗显隐切换
  const toggleModalStatus = (status) => {
    userModalRef.current.toggleShowStatus(status)
  }
  const toggleTableStatus = (status) => {
    dictItemModalRef.current.toggleShowStatus(status)
  }

  return <>
    <SearchBar formItemList={formItemList} getSearchParams={onParamChange} />
    <Card>
      <Space>
        <AuthComponent permission="system:dict:add" onClick={addRow}>
          新增
        </AuthComponent>
      </Space>
    </Card>
    <CustomTable
      columns={columns}
      rowKey="dict_code"
      pageType="Dict"
      bordered
      fetchMethod={dictApi.manage.query}
      requestParam={requestParam}
      onParamChange={onParamChange}
    />
    <CustomModal title="字典编辑" ref={userModalRef}>
      <DictEditForm
        editType={editType}
        dict_id={dict_id}
        dict={{ statusDict }}
        onRefreshTable={onParamChange}
        toggleModalStatus={toggleModalStatus}
      />
    </CustomModal>
    <CustomModal title="字典项" width="80%" ref={dictItemModalRef}>
      <DictItemTable
        editType={editType}
        dict_id={dict_id}
        dict={{ statusDict }}
        onRefreshTable={onParamChange}
        toggleModalStatus={toggleTableStatus}
      />
    </CustomModal>
  </>
}

export default Dict