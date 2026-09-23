import { apiSlice } from "./apiSlice";

export const formApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query({
      query: () => "/forms",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Form", id: _id })),
              { type: "Form", id: "LIST" },
            ]
          : [{ type: "Form", id: "LIST" }],
    }),

    getFormById: builder.query({
      query: (id) => `/forms/${id}`,
      providesTags: (result, error, id) => [{ type: "Form", id }],
    }),

    createForm: builder.mutation({
      query: (formData) => ({
        url: "/forms",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Form", id: "LIST" }],
    }),

    generateFormWithAI: builder.mutation({
      query: (payload) => ({
        url: "/ai/generate-form",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Form", id: "LIST" }],
    }),

    generateOptionsWithAI: builder.mutation({
      query: (payload) => ({
        url: "/ai/generate-options",
        method: "POST",
        body: payload,
      }),
    }),

    generateQuestionWithAI: builder.mutation({
      query: (payload) => ({
        url: "/ai/generate-question",
        method: "POST",
        body: payload,
      }),
    }),

    editQuestionWithAI: builder.mutation({
      query: (payload) => ({
        url: "/ai/edit-question",
        method: "POST",
        body: payload,
      }),
    }),

    generateImageWithAI: builder.mutation({
      query: (payload) => ({
        url: "/ai/generate-image",
        method: "POST",
        body: payload,
      }),
    }),

    summarizeResponsesWithAI: builder.mutation({
      query: (payload) => ({
        url: "/ai/summarize-responses",
        method: "POST",
        body: payload,
      }),
    }),

    updateForm: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `/forms/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Form", id: "LIST" },
        { type: "Form", id },
      ],
    }),

    updateFormName: builder.mutation({
      query: ({ id, name }) => ({
        url: `/forms/${id}/name`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Form", id: "LIST" },
        { type: "Form", id },
      ],
    }),

    toggleFormStar: builder.mutation({
      query: ({ id, isStarred }) => ({
        url: `/forms/${id}/star`,
        method: "PATCH",
        body: { isStarred },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Form", id: "LIST" },
        { type: "Form", id },
      ],
    }),

    deleteForm: builder.mutation({
      query: (id) => ({
        url: `/forms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Form", id: "LIST" }],
    }),

    submitResponse: builder.mutation({
      query: ({ formId, answers, respondentEmail }) => ({
        url: `/forms/${formId}/responses`,
        method: "POST",
        body: { answers, respondentEmail },
      }),
      invalidatesTags: (result, error, { formId }) => [
        { type: "Response", id: formId },
      ],
    }),

    getFormResponses: builder.query({
      query: (formId) => `/forms/${formId}/responses`,
      providesTags: (result, error, formId) => [
        { type: "Response", id: formId },
      ],
    }),

    deleteAllResponses: builder.mutation({
      query: (formId) => ({
        url: `/forms/${formId}/responses`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, formId) => [
        { type: "Response", id: formId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFormsQuery,
  useGetFormByIdQuery,
  useCreateFormMutation,
  useGenerateFormWithAIMutation,
  useGenerateOptionsWithAIMutation,
  useGenerateQuestionWithAIMutation,
  useEditQuestionWithAIMutation,
  useGenerateImageWithAIMutation,
  useSummarizeResponsesWithAIMutation,
  useUpdateFormMutation,
  useUpdateFormNameMutation,
  useToggleFormStarMutation,
  useDeleteFormMutation,
  useSubmitResponseMutation,
  useGetFormResponsesQuery,
  useDeleteAllResponsesMutation,
} = formApi;
