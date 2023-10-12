import { useState } from 'react'
import { useAddGroupMutation } from '../reducers/api'

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('')
    const [createGroup] = useAddGroupMutation()

   const handleCreateGroup = async () => {
        try {
            const response = await createGroup({ name: groupName})
        }catch(err) {
            console.error("Error creating group:", err)
        }
    }

  return (
    <div>
      <h1>test add group</h1>
      <input 
      type="text" 
      placeholder='Group Name'
      value={groupName}
      onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handleCreateGroup}>create group</button>
    </div>
  )
}

export default CreateGroup
