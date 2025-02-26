import { useMutation } from '@tanstack/react-query'
import { User } from '@/utils/types/auth'
import axios from 'axios'

// Define payload types for different actions
type UpdateUserPayload = {
  userId: string
  payload: Partial<User>
}

type DeleteUserPayload = {
  userId: string
}

// Union type for all possible payloads
type UserActionPayload = UpdateUserPayload | DeleteUserPayload

export const useUserAction = (type: "update" | "delete" = "update") => {
  // Mutation function with correct typing for update
  const updateMutationFn = async ({ userId, payload }: UpdateUserPayload): Promise<User> => {
    const { data } = await axios.put<User>(`/api/routes/users/update?userId=${userId}`, payload)
    return data
  }

  // Mutation function for delete
  const deleteMutationFn = async ({ userId }: DeleteUserPayload): Promise<User> => {
    const { data } = await axios.delete<User>(`/api/routes/users/delete?userId=${userId}`)
    return data
  }

  const successFn = (user: User, actionType: "update" | "delete") => {
    console.log(`User ${actionType}d successfully`, user)
  }

  const errorFn = (error: Error, actionType: "update" | "delete") => {
    console.error(`User ${actionType} failed`, error)
  }

  // Conditional mutation function based on type
  const mutationFn = type === "update" 
    ? updateMutationFn 
    : deleteMutationFn

  return useMutation<
    User, 
    Error, 
    UpdateUserPayload
  >({
    mutationFn,
    onSuccess: (updatedUser) => successFn(updatedUser, type),
    onError: (error) => errorFn(error, type)
  })
}