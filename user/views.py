import random
import json

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from user.models import User
from user.serializers import UserSerializer, PhoneNumberSerializer

from user.naver_sms.utils import make_signature, send_sms


class CheckPhoneNumberView(APIView):
    """
    Ncloud를 이용한 인증 번호 확인 API
    """

    def post(self, request):
        phone_serializer = PhoneNumberSerializer(data=request.data)
        signature, timestamp = make_signature()

        random_number = str(random.randrange(1000, 10000))
        if phone_serializer.is_valid():
            phone_number = request.data["phone_number"]
            res = send_sms(signature, timestamp, random_number, phone_number)

            if res.status_code >= 200 and res.status_code < 300:
                current_user = get_object_or_404(User, phone_number=phone_number)
                if current_user:
                    User.objects.update(auth_number = random_number)
                else:
                    User.objects.create(phone_number=phone_number, auth_number=random_number)
                
                return Response({"msg": "메세지 전송 완료"}, status=res.status_code)
            else:
                return Response({"msg": "메세지 전송 실패"}, status=res.status_code)
        return Response(
            {"error": phone_serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )

class CheckAuthNumberView(APIView):
    '''
    인증번호 일치 확인 API
    '''
    def post(self, request):
        phone_number = request.data['phone_number']
        input_number = request.data['input_number']
        
        current_user = get_object_or_404(User, phone_number=phone_number)
        if current_user:
            if current_user.auth_number == input_number:
                return Response({"msg": "인증이 완료되었습니다."}, status=status.HTTP_200_OK)
            else:
                return Response({"msg": "번호가 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"msg": "저장된 번호가 없습니다."}, status=status.HTTP_404_NOT_FOUND)
