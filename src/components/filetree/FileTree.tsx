import React, { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { Tree, TreeDataProvider, TreeItem, TreeItemIndex, UncontrolledTreeEnvironment } from "react-complex-tree"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileAlt, faFolder, faFolderOpen } from "@fortawesome/free-solid-svg-icons"

// CustomDataProviderImplementation 클래스를 먼저 정의합니다.
class CustomDataProviderImplementation implements TreeDataProvider<any> {
  // injectFolder(arg0: string) {
  //   throw new Error("Method not implemented.")
  // }
  // 클래스 내용은 그대로 유지

  data: any // any 타입으로 변경
  treeChangeListeners: ((changedItemIds: any) => void)[] // 변경된 형식에 맞게 수정
  constructor(initialData: any) {
    // any 타입으로 변경
    this.data = initialData
    this.treeChangeListeners = []
  }

  async getTreeItem(itemId: string | number) {
    return this.data[itemId] || { children: [] }
  }

  async onChangeItemChildren(itemId: string | number, newChildren: any) {
    // this.data 내에 itemId가 존재하는지 확인
    if (this.data[itemId]) {
      this.data[itemId].children = newChildren
      this.treeChangeListeners.forEach(listener => listener([itemId]))
    } else {
      // 아이템이 존재하지 않는 경우, 콘솔에 오류 메시지를 출력하거나 적절한 처리를 할 수 있습니다.
      console.error(`아이템 ID '${itemId}'에 해당하는 아이템이 존재하지 않습니다.`)
    }
  }

  onDidChangeTreeData(listener: (changedItemIds: any) => void) {
    this.treeChangeListeners.push(listener)
    return {
      dispose: () => this.treeChangeListeners.splice(this.treeChangeListeners.indexOf(listener), 1)
    }
  }

  async onRenameItem(item: { index: string | number }, name: any) {
    // this.data[item.index]가 정의되어 있는지 확인하고, 정의되어 있다면 'data' 속성 설정
    if (this.data[item.index]) {
      this.data[item.index].data = name
    }
  }

  injectItem(name: string) {
    const rand = `${Math.random()}`
    this.data[rand] = { data: name, index: rand, children: [] }
    this.data.root.children.push(rand)
    this.treeChangeListeners.forEach(listener => listener(["root"]))
  }

  injectFolder(name: string) {
    const rand = `${Math.random()}`
    // 'isFolder' 속성을 true로 설정하여 이 아이템이 폴더임을 나타냅니다.
    this.data[rand] = { data: name, index: rand, children: [], isFolder: true }
    this.data.root.children.push(rand)
    this.treeChangeListeners.forEach(listener => listener(["root"]))
  }

  removeItem() {
    if (this.data.root.children.length === 0) return
    const removedItemId = this.data.root.children.pop()
    this.treeChangeListeners.forEach(listener => listener(["root"]))
    delete this.data[removedItemId]
  }
}

function FileTree() {
  const [initialData, setInitialData] = useState<any>({})
  const [expandedFolders, setExpandedFolders] = useState<TreeItemIndex[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/files")
        setInitialData(response.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const dataProvider = useMemo(() => new CustomDataProviderImplementation(initialData), [initialData])

  const injectItem = () => {
    if (dataProvider) dataProvider.injectItem("New Item")
    console.log("새파일추가") // dataProvider가 null이 아닐 때만 호출
  }

  const injectFolder = () => {
    if (dataProvider) dataProvider.injectFolder("New Folder")
    console.log("새 폴더 추가")
  }

  useEffect(() => {
    if (dataProvider) {
      const dispose = dataProvider.onDidChangeTreeData((changedItemIds: any) => {
        console.log(changedItemIds)
      })

      return () => {
        dispose.dispose()
      }
    }
  }, [dataProvider])

  return (
    <UncontrolledTreeEnvironment
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      dataProvider={dataProvider}
      getItemTitle={item => item.data}
      viewState={{
        "tree-1": {
          expandedItems: []
        }
      }}
      renderItemTitle={({ title }) => <span>{title}</span>}
      renderItemArrow={({ item, context }) =>
        item.isFolder ? (
          <span {...context.arrowProps}>
            {context.isExpanded ? <FontAwesomeIcon icon={faFolderOpen} /> : <FontAwesomeIcon icon={faFolder} />}
          </span>
        ) : null
      }
      renderTreeContainer={({ children, containerProps }) => <div {...containerProps}>{children}</div>}
      renderItemsContainer={({ children, containerProps }) => <ul {...containerProps}>{children}</ul>}
      renderItem={({
        title,
        arrow,
        depth,
        context,
        children,
        item
      }: {
        title: string | React.ReactNode
        arrow: JSX.Element | React.ReactNode
        depth: number
        context: any
        children: React.ReactNode
        item: TreeItem<any>
      }) => (
        <li
          {...context.itemContainerWithChildrenProps}
          style={{
            margin: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
          }}
        >
          <span
            {...context.itemContainerWithoutChildrenProps}
            {...context.interactiveElementProps}
            style={{ cursor: "pointer" }}
            // Tailwind CSS 클래스를 사용하여 항목의 depth에 따라 왼쪽 마진을 조절합니다.
            // 예: depth가 1이면 ml-4, 2이면 ml-8과 같이 적용됩니다.
            className={`ml-${depth * 4} flex items-center`}
          >
            {/* 폴더와 파일에 따라 다른 아이콘 표시 */}
            {item.isFolder ? (
              // 폴더가 닫힌 경우 폴더 아이콘 표시
              ""
            ) : (
              // 파일인 경우 파일 아이콘 표시
              <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: "5px" }} />
            )}
            {arrow}
            {title}
          </span>

          {children}
        </li>
      )}
    >
      <button
        type="button"
        onClick={injectItem}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Inject item
      </button>
      <button
        type="button"
        onClick={injectFolder}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        injectFolder
      </button>
      <div className="noCSS">
        <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
      </div>
    </UncontrolledTreeEnvironment>
  )
}

export default FileTree
